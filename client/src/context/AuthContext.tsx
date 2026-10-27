import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string, 
    pass: string, 
    fullName: string, 
    phone?: string, 
    age?: number, 
    gender?: 'Female' | 'Male' | 'Other' | 'Prefer not to say'
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create profile in Firestore
  const syncUserProfile = async (user: User, additionalData?: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUserProfile(data);
      } else {
        const newProfile: UserProfile = {
          uid: user.uid,
          fullName: additionalData?.fullName || user.displayName || 'Patient',
          email: user.email || '',
          phone: additionalData?.phone || '',
          age: additionalData?.age || 30,
          gender: additionalData?.gender || 'Prefer not to say',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, {
          ...newProfile,
          updatedAt: serverTimestamp(),
        });
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not sync profile to Firestore, falling back to client profile', err);
      // Fallback local profile if offline or rules pending
      setUserProfile({
        uid: user.uid,
        fullName: additionalData?.fullName || user.displayName || 'Patient',
        email: user.email || '',
        phone: additionalData?.phone || '',
        age: additionalData?.age || 30,
        gender: additionalData?.gender || 'Prefer not to say',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncUserProfile(cred.user);
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    fullName: string, 
    phone?: string, 
    age?: number, 
    gender?: 'Female' | 'Male' | 'Other' | 'Prefer not to say'
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: fullName });
    await syncUserProfile(cred.user, { fullName, phone, age, gender });
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

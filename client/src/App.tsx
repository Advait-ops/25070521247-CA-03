/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView, Appointment, Doctor } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { DepartmentsPage } from './components/pages/DepartmentsPage';
import { DoctorsPage } from './components/pages/DoctorsPage';
import { AboutPage } from './components/pages/AboutPage';
import { AppointmentModal } from './components/AppointmentModal';
import { MyAppointmentsDrawer } from './components/MyAppointmentsDrawer';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DoctorProvider } from './context/DoctorContext';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  saveMongoAppointment, 
  updateMongoAppointmentStatus, 
  fetchMongoAppointments, 
  checkMongoStatus, 
  MongoStatus 
} from './services/mongoAppointmentService';

function HospitalApp() {
  const { currentUser, userProfile } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDepartmentId, setBookingDepartmentId] = useState<string | undefined>();
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>();
  const [isAppointmentsDrawerOpen, setIsAppointmentsDrawerOpen] = useState(false);
  const [selectedDoctorForBio, setSelectedDoctorForBio] = useState<Doctor | null>(null);

  // MongoDB Status
  const [mongoDbStatus, setMongoDbStatus] = useState<{ connected: boolean; source: string }>({
    connected: false,
    source: 'checking...',
  });

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{
    departmentId?: string;
    doctorId?: string;
  } | null>(null);

  // Appointments storage (cached in localStorage + real-time synced with MongoDB & Firestore)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem('medilife_appointments');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading appointments from localStorage', e);
    }
    return [];
  });

  // Check MongoDB server status on load
  useEffect(() => {
    checkMongoStatus().then((status) => {
      setMongoDbStatus({
        connected: status.connectedToMongo,
        source: status.database === 'mongodb' ? 'medilife_hospital' : 'ready',
      });
    });
  }, []);

  // Fetch appointments from MongoDB backend when user is loaded
  useEffect(() => {
    async function loadMongoAppointments() {
      const mongoList = await fetchMongoAppointments(currentUser?.uid);
      if (mongoList && mongoList.length > 0) {
        setAppointments((prev) => {
          const map = new Map<string, Appointment>();
          prev.forEach((a) => map.set(a.id, a));
          mongoList.forEach((a) => map.set(a.id, a));
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
    }
    loadMongoAppointments();
  }, [currentUser]);

  // Listen to user's appointments in Firestore when logged in (dual backup)
  useEffect(() => {
    if (!currentUser) return;

    try {
      const appointmentsRef = collection(db, 'users', currentUser.uid, 'appointments');
      const unsubscribe = onSnapshot(appointmentsRef, (snapshot) => {
        const fetchedList: Appointment[] = [];
        snapshot.forEach((docSnap) => {
          fetchedList.push(docSnap.data() as Appointment);
        });

        if (fetchedList.length > 0) {
          fetchedList.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setAppointments(fetchedList);
        }
      }, (err) => {
        console.warn('Firestore real-time subscription note:', err.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not establish Firestore listener', e);
    }
  }, [currentUser]);

  // Persist appointments locally
  useEffect(() => {
    try {
      localStorage.setItem('medilife_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.error('Error saving appointments to localStorage', e);
    }
  }, [appointments]);

  // Handle open booking: Requires Sign In / Sign Up first if not authenticated
  const handleOpenBooking = (departmentId?: string, doctorId?: string) => {
    if (!currentUser) {
      setPendingBooking({ departmentId, doctorId });
      setIsAuthModalOpen(true);
      return;
    }

    setBookingDepartmentId(departmentId);
    setBookingDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  // Called when user successfully signs in from AuthModal
  const handleAuthSuccess = () => {
    if (pendingBooking) {
      setBookingDepartmentId(pendingBooking.departmentId);
      setBookingDoctorId(pendingBooking.doctorId);
      setPendingBooking(null);
      setIsBookingOpen(true);
    }
  };

  // Add new appointment & store in MongoDB and Firestore
  const handleAppointmentCreated = async (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);

    // 1. Store in MongoDB database
    await saveMongoAppointment(newAppointment);

    // 2. Store in Firestore if user is authenticated
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'appointments', newAppointment.id), {
          ...newAppointment,
          userId: currentUser.uid,
          updatedAt: serverTimestamp(),
        });

        await setDoc(doc(db, 'appointments', newAppointment.id), {
          ...newAppointment,
          userId: currentUser.uid,
          patientEmail: currentUser.email,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firestore appointment save note:', e);
      }
    }
  };

  // Cancel appointment in state, MongoDB and Firestore
  const handleCancelAppointment = async (id: string) => {
    setAppointments((prev) => {
      const updated = prev.map((apt) =>
        (apt.id === id || apt.confirmationCode === id)
          ? { ...apt, status: 'Cancelled' as const }
          : apt
      );
      try {
        localStorage.setItem('medilife_appointments', JSON.stringify(updated));
      } catch (err) {
        // ignore
      }
      return updated;
    });

    // 1. Update in MongoDB
    try {
      await updateMongoAppointmentStatus(id, 'Cancelled');
    } catch (err) {
      console.warn('MongoDB cancel appointment note:', err);
    }

    // 2. Update in Firestore with merge: true so it never throws on missing doc
    if (currentUser) {
      try {
        await setDoc(
          doc(db, 'users', currentUser.uid, 'appointments', id),
          {
            status: 'Cancelled',
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        await setDoc(
          doc(db, 'appointments', id),
          {
            status: 'Cancelled',
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Firestore status update note:', e);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-800 antialiased selection:bg-[#2D543E]/20 selection:text-[#1B3527]">
      {/* Top 3-Zone Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyAppointments={() => setIsAppointmentsDrawerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        appointmentCount={appointments.filter((a) => a.status === 'Confirmed').length}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            onOpenBooking={handleOpenBooking}
            onViewDoctorProfile={setSelectedDoctorForBio}
          />
        )}

        {currentPage === 'departments' && (
          <DepartmentsPage
            onOpenBooking={handleOpenBooking}
            onViewDoctorProfile={setSelectedDoctorForBio}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsPage
            onOpenBooking={handleOpenBooking}
            onViewDoctorProfile={setSelectedDoctorForBio}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={setCurrentPage}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPortal />
        )}
      </main>

      {/* Site Footer */}
      <Footer
        onNavigate={setCurrentPage}
        onOpenBooking={(deptId) => handleOpenBooking(deptId)}
      />

      {/* Multi-Step Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDepartmentId={bookingDepartmentId}
        initialDoctorId={bookingDoctorId}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* My Appointments Drawer */}
      <MyAppointmentsDrawer
        isOpen={isAppointmentsDrawerOpen}
        onClose={() => setIsAppointmentsDrawerOpen(false)}
        appointments={appointments}
        onCancelAppointment={handleCancelAppointment}
        onNewBooking={() => handleOpenBooking()}
        databaseStatus={mongoDbStatus}
      />

      {/* Doctor Detailed Bio Modal */}
      <DoctorProfileModal
        doctor={selectedDoctorForBio}
        onClose={() => setSelectedDoctorForBio(null)}
        onBookDoctor={(doc) => handleOpenBooking(doc.departmentId, doc.id)}
      />

      {/* Firebase Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingBooking(null);
        }}
        onSuccess={handleAuthSuccess}
        promptMessage={
          pendingBooking
            ? 'Please sign in or create an account to schedule your appointment at Medilife General Hospital.'
            : undefined
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DoctorProvider>
        <HospitalApp />
      </DoctorProvider>
    </AuthProvider>
  );
}


import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
  promptMessage,
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other' | 'Prefer not to say'>('Female');
  
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        await signInWithEmail(email.trim(), password);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please provide your full name.');
        }
        if (!email.trim() || !password) {
          throw new Error('Please provide a valid email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUpWithEmail(
          email.trim(), 
          password, 
          fullName.trim(), 
          phone.trim() || undefined, 
          age, 
          gender
        );
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Auth error', err);
      let msg = err.message || 'Authentication failed. Please try again.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. Please check and retry.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email. Please sign up.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign-in popup was closed before completion.';
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#2D543E] text-white flex items-center justify-center font-bold text-xs">
                M
              </div>
              <span className="text-xs font-semibold text-[#2D543E] uppercase tracking-wider">
                Medilife Patient Access
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'signin' ? 'Sign In to Your Account' : 'Create Patient Profile'}
            </h2>
            {promptMessage && (
              <p className="text-xs text-stone-600 mt-1">
                {promptMessage}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-slate-800 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-stone-100 p-1 m-6 mb-2 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Or with email
            </span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] active:scale-[0.99] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : mode === 'signin' ? 'Sign In & Continue' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500">
          {mode === 'signin' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-[#2D543E] font-bold hover:underline"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="text-[#2D543E] font-bold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

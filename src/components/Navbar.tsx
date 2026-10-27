import React, { useState } from 'react';
import { PageView } from '../types';
import { Phone, CalendarCheck2, Menu, X, Clock, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { HOSPITAL_CONTACT } from '../data/hospitalData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenAuth: () => void;
  appointmentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
  onOpenMyAppointments,
  onOpenAuth,
  appointmentCount,
}) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSuperAdmin = currentUser?.email === 'advait.adkine@gmail.com';

  const navItems: { id: PageView; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'about', label: 'About Us' },
    { id: 'admin', label: 'Admin Portal', badge: isSuperAdmin ? 'Super Admin' : 'Admin' },
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Reassuring Top Hospital Hotline Strip */}
      <div className="bg-[#244230] text-emerald-100 text-xs py-2 px-4 sm:px-8 border-b border-emerald-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">24/7 Emergency & Trauma Hotline:</span>
              <a
                href={`tel:${HOSPITAL_CONTACT.emergencyPhone}`}
                className="font-mono text-emerald-300 hover:text-white transition-colors underline decoration-emerald-500/50"
              >
                {HOSPITAL_CONTACT.emergencyPhone}
              </a>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visiting Hours: 08:00 AM – 08:30 PM Daily</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-stone-300">Springfield Healthcare District</span>
            <span className="text-emerald-400 font-medium">Walk-ins Welcome</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3-Zone Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2D543E] text-white flex items-center justify-center font-display font-bold text-xl shadow-xs group-hover:bg-[#234331] transition-colors">
              M
            </div>
            <div className="whitespace-nowrap shrink-0">
              <span className="block text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#2D543E] transition-colors">
                Medilife General Hospital
              </span>
              <span className="block text-xs text-stone-500 font-normal">
                Care · Precision · Dignity
              </span>
            </div>
          </button>

          {/* Zone 2: 4 clean single-line nav links + Admin Portal */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isAdmin = item.id === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`whitespace-nowrap shrink-0 py-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentPage === item.id
                      ? 'border-[#2D543E] text-[#2D543E] font-semibold'
                      : isAdmin
                      ? 'border-transparent text-emerald-800 hover:text-emerald-950 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-stone-300'
                  }`}
                >
                  {isAdmin && <ShieldCheck className="w-4 h-4 text-emerald-700" />}
                  <span>{item.label}</span>
                  {isAdmin && item.badge && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>


          {/* Zone 3: 1 primary action + My Bookings Drawer trigger + User Profile/Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* My Appointments Button */}
            <button
              onClick={onOpenMyAppointments}
              className="relative p-2 text-slate-600 hover:text-[#2D543E] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="View my appointments"
              aria-label="View scheduled appointments"
            >
              <CalendarCheck2 className="w-5 h-5" />
              {appointmentCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2D543E] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                  {appointmentCount}
                </span>
              )}
            </button>

            {/* User Account / Sign In State */}
            {currentUser ? (
              <div className="hidden lg:flex items-center gap-2 pl-1 border-l border-stone-200">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-[#2D543E] text-white font-bold flex items-center justify-center text-xs">
                    {(userProfile?.fullName || currentUser.displayName || currentUser.email || 'P')[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-slate-900 block truncate max-w-[110px]">
                      {userProfile?.fullName || currentUser.displayName || 'Patient'}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate max-w-[110px]">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#2D543E] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] active:scale-[0.99] transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Book Appointment</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-6 py-5 space-y-4 shadow-lg animate-in fade-in duration-150">
          {currentUser ? (
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#2D543E] text-white font-bold flex items-center justify-center text-sm">
                  {(userProfile?.fullName || currentUser.displayName || currentUser.email || 'P')[0].toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">
                    {userProfile?.fullName || currentUser.displayName || 'Patient'}
                  </span>
                  <span className="text-xs text-stone-500 block">
                    {currentUser.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pb-3 border-b border-stone-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-semibold text-slate-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-[#2D543E]" />
                <span>Sign In / Create Patient Account</span>
              </button>
            </div>
          )}

          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isAdmin = item.id === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    currentPage === item.id
                      ? 'bg-emerald-50 text-[#2D543E] font-semibold'
                      : isAdmin
                      ? 'bg-stone-50 text-emerald-900 font-semibold'
                      : 'text-slate-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isAdmin && <ShieldCheck className="w-4 h-4 text-[#2D543E]" />}
                    <span>{item.label}</span>
                  </div>
                  {isAdmin && item.badge && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyAppointments();
              }}
              className="w-full py-2.5 text-center text-sm font-medium text-slate-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4 text-[#2D543E]" />
              <span>My Appointments ({appointmentCount})</span>
            </button>
            <div className="pt-2 text-xs text-stone-500 text-center">
              Emergency: <a href={`tel:${HOSPITAL_CONTACT.emergencyPhone}`} className="text-red-600 font-bold">{HOSPITAL_CONTACT.emergencyPhone}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { PageView } from '../types';
import { HOSPITAL_CONTACT, DEPARTMENTS } from '../data/hospitalData';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: (departmentId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-[#1C3325] text-stone-300 border-t border-emerald-950/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Charter */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-display font-bold text-xl shadow-xs">
                M
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-white font-display">
                  Medilife General Hospital
                </span>
                <span className="block text-xs text-emerald-400">
                  Care · Precision · Dignity
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Medilife General Hospital is a regional accredited tertiary healthcare institution dedicated to patient-centered clinical excellence, emergency surgical response, and compassionate specialized healing.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Joint Commission International (JCI) Accredited</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Level-1 Regional Trauma Center & Helipad</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('departments');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Medical Departments
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('doctors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Specialist Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Hospital
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-emerald-300 hover:text-white font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin & Doctor Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking()}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>


          {/* Col 3: Departments Directory */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Clinical Departments
            </h4>
            <ul className="space-y-2 text-xs">
              {DEPARTMENTS.map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      onNavigate('departments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Urgent & Direct Contacts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Emergency & Inquiries
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-red-400 font-bold block">
                  24/7 Trauma Hotline
                </span>
                <a
                  href={`tel:${HOSPITAL_CONTACT.emergencyPhone}`}
                  className="text-white font-mono font-bold text-sm hover:text-emerald-300 transition-colors"
                >
                  {HOSPITAL_CONTACT.emergencyPhone}
                </a>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                  Appointments & General Desk
                </span>
                <a
                  href={`tel:${HOSPITAL_CONTACT.appointmentsPhone}`}
                  className="text-white hover:text-emerald-300 transition-colors"
                >
                  {HOSPITAL_CONTACT.appointmentsPhone}
                </a>
              </div>

              <div className="pt-1 text-stone-400 space-y-1">
                <p>{HOSPITAL_CONTACT.address}</p>
                <p>{HOSPITAL_CONTACT.cityState}</p>
                <p>{HOSPITAL_CONTACT.visitingHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} Medilife General Hospital. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Patient Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">HIPAA Compliance</span>
            <span className="hover:text-white cursor-pointer transition-colors">Accessibility Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

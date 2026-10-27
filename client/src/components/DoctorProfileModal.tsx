import React from 'react';
import { X, Calendar, MapPin, Award, GraduationCap, Languages, Stethoscope } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBookDoctor,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between relative">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doctor.imageFallbackGradient} text-white flex items-center justify-center font-display font-bold text-2xl shadow-sm shrink-0`}>
              {doctor.name.split(' ').map((n) => n[0]).filter((_, i) => i < 2).join('')}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2D543E]">
                {doctor.departmentName}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {doctor.name}
              </h2>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                {doctor.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
                <span>{doctor.experienceYears} Years Experience</span>
                <span aria-hidden="true">·</span>
                <span>{doctor.roomNumber}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-slate-800 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Clinical Background & Philosophy
            </h3>
            <p className="text-stone-700 leading-relaxed text-sm">
              {doctor.bio}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                <GraduationCap className="w-4 h-4 text-[#2D543E]" />
                <span>Education & Fellowships</span>
              </div>
              <ul className="space-y-1 text-xs text-stone-700">
                {doctor.education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#2D543E] mt-0.5">•</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                <Award className="w-4 h-4 text-[#2D543E]" />
                <span>Board Memberships</span>
              </div>
              <ul className="space-y-1 text-xs text-stone-700">
                {doctor.memberships.map((mem, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#2D543E] mt-0.5">•</span>
                    <span>{mem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block mb-1">Consultation Schedule</span>
              <span className="font-semibold text-slate-900 block">
                {doctor.availableDays.join(', ')}
              </span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block mb-1">Languages Spoken</span>
              <span className="font-semibold text-slate-900 block">
                {doctor.languages.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] text-stone-500 block">Standard Consultation</span>
            <span className="text-lg font-bold font-display text-slate-900">
              {doctor.consultationFee}
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              onBookDoctor(doctor);
            }}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors cursor-pointer shadow-xs"
          >
            Book Consultation with {doctor.name.split(',')[0]}
          </button>
        </div>
      </div>
    </div>
  );
};

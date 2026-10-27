import React from 'react';
import { Doctor } from '../types';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  onViewProfile: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBook,
  onViewProfile,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#2D543E]/40 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Doctor Lockup */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doctor.imageFallbackGradient} text-white flex items-center justify-center font-display font-bold text-lg shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
            {doctor.name.split(' ').map((n) => n[0]).filter((_, i) => i < 2).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#2D543E] transition-colors truncate">
              {doctor.name}
            </h3>
            <p className="text-xs font-semibold text-[#2D543E] mt-0.5 truncate">
              {doctor.specialty}
            </p>
            {/* Zero-Pill Typography Metadata */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1 truncate">
              <span>{doctor.departmentName.split('&')[0].trim()}</span>
              <span aria-hidden="true">·</span>
              <span>{doctor.experienceYears} Yrs Exp</span>
              <span aria-hidden="true">·</span>
              <span>{doctor.roomNumber}</span>
            </div>
          </div>
        </div>

        {/* Academic Qualification & Days */}
        <div className="space-y-2 py-3 border-t border-stone-100 text-xs">
          <p className="text-stone-600 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>

          <div className="bg-stone-50/90 rounded-xl p-2.5 border border-stone-100/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-600">
              <span className="text-stone-400">Available:</span>
              <span className="font-medium text-slate-800 truncate ml-2">
                {doctor.availableDays.slice(0, 3).join(', ')}{doctor.availableDays.length > 3 ? ' +' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-600">
              <span className="text-stone-400">Languages:</span>
              <span className="font-medium text-slate-800">
                {doctor.languages.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Fee and Actions */}
      <div className="pt-3 border-t border-stone-100 mt-2 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Fee</span>
          <span className="text-base font-bold font-display text-slate-900 tabular-nums">
            {doctor.consultationFee}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile(doctor)}
            className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-slate-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => onBook(doctor)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] active:scale-[0.98] transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};

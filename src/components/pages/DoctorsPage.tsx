import React, { useState, useMemo } from 'react';
import { Search, Filter, Stethoscope, ArrowRight, X, Calendar } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../../data/hospitalData';
import { Doctor } from '../../types';
import { DoctorCard } from '../DoctorCard';
import { DepartmentIcon } from '../DepartmentIcon';

interface DoctorsPageProps {
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onOpenBooking,
  onViewDoctorProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [minExperience, setMinExperience] = useState<number>(0);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      // Dept filter
      if (selectedDepartment !== 'all' && doc.departmentId !== selectedDepartment) {
        return false;
      }
      // Experience filter
      if (minExperience > 0 && doc.experienceYears < minExperience) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesSpecialty = doc.specialty.toLowerCase().includes(query);
        const matchesDept = doc.departmentName.toLowerCase().includes(query);
        const matchesBio = doc.bio.toLowerCase().includes(query);
        const matchesLang = doc.languages.some((l) => l.toLowerCase().includes(query));
        return matchesName || matchesSpecialty || matchesDept || matchesBio || matchesLang;
      }
      return true;
    });
  }, [searchQuery, selectedDepartment, minExperience]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setMinExperience(0);
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-16 max-w-7xl mx-auto px-4 sm:px-8 pt-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D543E] bg-[#2D543E]/10 px-3 py-1 rounded-full">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Medilife Medical Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Our Medical Specialists & Faculty
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            Browse our directory of 16 board-certified physicians, surgeon leaders, and subspecialty consultants. Each doctor maintains dedicated outpatient hours with direct digital scheduling.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenBooking()}
          className="shrink-0 px-6 py-3.5 bg-[#2D543E] hover:bg-[#234331] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>General Appointment Desk</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, specialty, condition, or spoken language..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900 bg-stone-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Experience Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs text-stone-500 whitespace-nowrap">Experience:</span>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-800 bg-stone-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
            >
              <option value={0}>All Experience Levels</option>
              <option value={10}>10+ Years Practice</option>
              <option value={15}>15+ Years Practice</option>
              <option value={20}>20+ Years Practice</option>
            </select>
          </div>
        </div>

        {/* Department Filter Segmented Tabs */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDepartment('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDepartment === 'all'
                ? 'bg-[#2D543E] text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Specialties ({DOCTORS.length})
          </button>
          {DEPARTMENTS.map((dept) => {
            const count = DOCTORS.filter((d) => d.departmentId === dept.id).length;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedDepartment === dept.id
                    ? 'bg-[#2D543E] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <DepartmentIcon name={dept.iconName} className="w-3.5 h-3.5" />
                <span>{dept.name.split('&')[0].trim()} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Count Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> of{' '}
          <strong className="text-slate-900">{DOCTORS.length}</strong> Board-Certified Specialists
        </span>
        {(searchQuery || selectedDepartment !== 'all' || minExperience > 0) && (
          <button
            onClick={handleResetFilters}
            className="text-[#2D543E] hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Doctors Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">
              No matching medical specialists found
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              We couldn't find any physicians matching "{searchQuery}". Try adjusting your search query or reset the filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={() => onOpenBooking(doctor.departmentId, doctor.id)}
              onViewProfile={onViewDoctorProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

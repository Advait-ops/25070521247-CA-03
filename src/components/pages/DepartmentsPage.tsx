import React, { useState } from 'react';
import { 
  Building2, 
  Bed, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  PhoneCall 
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS, HOSPITAL_CONTACT } from '../../data/hospitalData';
import { Department, Doctor, PageView } from '../../types';
import { DepartmentIcon } from '../DepartmentIcon';
import { DoctorCard } from '../DoctorCard';

interface DepartmentsPageProps {
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
  onNavigate: (page: PageView) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  onOpenBooking,
  onViewDoctorProfile,
  onNavigate,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');

  const filteredDepartments = selectedDeptId === 'all'
    ? DEPARTMENTS
    : DEPARTMENTS.filter((d) => d.id === selectedDeptId);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 max-w-7xl mx-auto px-4 sm:px-8 pt-8">
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D543E] bg-[#2D543E]/10 px-3 py-1 rounded-full">
          <Building2 className="w-3.5 h-3.5" />
          <span>Clinical Excellence & Specialized Institutes</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Comprehensive Medical Departments
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Medilife General Hospital features six tertiary clinical institutes. Each department maintains dedicated inpatient wings, specialized catheterization or robotic suites, and multiple board-certified specialists.
        </p>
      </div>

      {/* Filter Tabs (Interactive Segmented Control) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => setSelectedDeptId('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            selectedDeptId === 'all'
              ? 'bg-[#2D543E] text-white shadow-xs'
              : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
          }`}
        >
          All Departments ({DEPARTMENTS.length})
        </button>
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedDeptId === dept.id
                ? 'bg-[#2D543E] text-white shadow-xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <DepartmentIcon name={dept.iconName} className="w-3.5 h-3.5" />
            <span>{dept.name.split('&')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Departments Detailed List */}
      <div className="space-y-16">
        {filteredDepartments.map((dept) => {
          const deptDoctors = DOCTORS.filter((d) => d.departmentId === dept.id);

          return (
            <section
              key={dept.id}
              id={dept.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden scroll-mt-24"
            >
              {/* Department Header Strip */}
              <div className="p-6 sm:p-8 bg-stone-50 border-b border-stone-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#2D543E] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <DepartmentIcon name={dept.iconName} className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1">
                        <span>{dept.floorLocation}</span>
                        <span aria-hidden="true">·</span>
                        <span>{dept.bedCount} Inpatient Beds</span>
                        {dept.isEmergency24x7 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-red-600">
                              24/7 Acute Admissions
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {dept.name}
                      </h2>
                      <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                        {dept.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenBooking(dept.id)}
                      className="px-5 py-2.5 bg-[#2D543E] hover:bg-[#234331] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book Department Consultation
                    </button>
                  </div>
                </div>
              </div>

              {/* Department Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Description & Diagnostics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Clinical Scope & Approach
                    </h3>
                    <p className="text-stone-700 text-sm leading-relaxed">
                      {dept.description}
                    </p>

                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                        Key Surgical & Therapeutic Procedures
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
                        {dept.keyServices.map((service, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D543E] shrink-0 mt-0.5" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Diagnostic Tech & Department Stats */}
                  <div className="lg:col-span-5 bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Specialized Diagnostic Suite
                      </h4>
                      <ul className="space-y-2 text-xs text-stone-700">
                        {dept.diagnosticTech.map((tech, tIdx) => (
                          <li key={tIdx} className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#2D543E]" />
                            <span className="font-medium text-slate-900">{tech}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-stone-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-stone-600">
                        <span>Staffed Senior Physicians:</span>
                        <strong className="text-slate-900">{deptDoctors.length} Specialists</strong>
                      </div>
                      <div className="flex items-center justify-between text-stone-600">
                        <span>Direct Nurse-to-Patient Ratio:</span>
                        <strong className="text-slate-900">1 : 3</strong>
                      </div>
                      <div className="flex items-center justify-between text-stone-600">
                        <span>Emergency Coverage:</span>
                        <strong className="text-slate-900">{dept.isEmergency24x7 ? '24/7 Rapid Response' : 'On-Call Surgeon'}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multiple Dedicated Doctors for this Department */}
                <div className="pt-6 border-t border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2D543E]">
                        Staff Physicians
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        Dedicated Specialists in {dept.name}
                      </h3>
                    </div>
                    <span className="text-xs text-stone-500">
                      {deptDoctors.length} Physicians Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {deptDoctors.map((doc) => (
                      <DoctorCard
                        key={doc.id}
                        doctor={doc}
                        onBook={() => onOpenBooking(dept.id, doc.id)}
                        onViewProfile={onViewDoctorProfile}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Emergency Assistance Footer Card */}
      <div className="bg-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Unsure which department fits your condition?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Our clinical triage coordinators are available 24/7 to guide you to the right physician or schedule diagnostic evaluations.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`tel:${HOSPITAL_CONTACT.mainPhone}`}
            className="px-5 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-slate-800 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            Call Triage Desk: {HOSPITAL_CONTACT.mainPhone}
          </a>
          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="px-5 py-2.5 bg-[#2D543E] hover:bg-[#234331] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            General Booking
          </button>
        </div>
      </div>
    </div>
  );
};

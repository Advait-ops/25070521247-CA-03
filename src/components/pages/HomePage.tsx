import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  HeartPulse, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Building2 
} from 'lucide-react';
import { 
  DEPARTMENTS, 
  DOCTORS, 
  HOSPITAL_STATS, 
  TESTIMONIALS, 
  ACCREDITATIONS, 
  HOSPITAL_CONTACT,
  HOSPITAL_IMAGES 
} from '../../data/hospitalData';
import { Department, Doctor, PageView } from '../../types';
import { DepartmentIcon } from '../DepartmentIcon';
import { DoctorCard } from '../DoctorCard';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onViewDoctorProfile,
}) => {
  // 4 Featured Doctors (Department Chiefs)
  const featuredDoctors = DOCTORS.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D543E] bg-[#2D543E]/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#2D543E]" />
              <span>Accredited Tertiary Hospital · Springfield District</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Where advanced medicine meets quiet human compassion.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Medilife General Hospital brings together leading board-certified specialists, 24/7 Level-1 trauma readiness, and state-of-the-art diagnostic suites in a healing, patient-centered atmosphere.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] active:scale-[0.99] transition-all cursor-pointer shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Consultation</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('doctors')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>Browse All 16 Doctors</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Quiet reassurance text */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D543E]" />
                <span>Zero-Wait Reception Pass</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D543E]" />
                <span>Major Insurance Accepted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D543E]" />
                <span>24/7 Trauma Surgery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Focal Carrier */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100 aspect-4/3 lg:aspect-square">
              <img
                src={HOSPITAL_IMAGES.exteriorCampus}
                alt="Medilife General Hospital Modern Healthcare Pavilion Exterior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                      Main Campus · 742 Healthcare Pkwy
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug">
                    Medilife Healthcare Pavilion
                  </h3>
                  <p className="text-xs text-stone-200">
                    Comprehensive inpatient suites, hybrid surgical operating rooms, and healing gardens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-COLUMN AUDITED METRIC STRIP */}
        <div className="mt-12 sm:mt-16 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
            {HOSPITAL_STATS.map((stat, i) => (
              <div key={i} className={`space-y-1 ${i > 0 ? 'sm:pl-8' : ''} ${i > 1 ? 'pt-4 sm:pt-0' : ''}`}>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  {stat.label}
                </div>
                <div className="text-xs text-stone-500">
                  {stat.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 24/7 EMERGENCY & CRITICAL ASSISTANCE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#244230] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-950/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Level-1 Trauma & Comprehensive Stroke Triage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Immediate emergency assistance, any hour of the day or night.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Our south emergency intake bays, direct rooftop medevac helipad, and continuous neuro/cardiac surgical teams operate 24/7/365 without exception.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href={`tel:${HOSPITAL_CONTACT.emergencyPhone}`}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Emergency Hotline: {HOSPITAL_CONTACT.emergencyPhone}</span>
            </a>
            <button
              onClick={() => onNavigate('departments')}
              className="inline-flex items-center justify-center px-5 py-3.5 bg-emerald-950/70 hover:bg-emerald-950 text-white font-medium text-xs rounded-xl border border-emerald-700/40 transition-colors whitespace-nowrap"
            >
              View ER Facilities
            </button>
          </div>
        </div>
      </section>

      {/* CORE MEDICAL DEPARTMENTS OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#2D543E]">
              Specialized Clinical Care
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Six Comprehensive Hospital Departments
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
              Each department is equipped with dedicated surgical theatres, intensive monitoring, and subspecialty physicians.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('departments')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D543E] hover:underline cursor-pointer"
          >
            <span>Explore All Department Capabilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Department Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map((dept) => {
            const docCount = DOCTORS.filter((d) => d.departmentId === dept.id).length;
            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#2D543E]/40 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2D543E]/10 text-[#2D543E] flex items-center justify-center group-hover:bg-[#2D543E] group-hover:text-white transition-colors">
                      <DepartmentIcon name={dept.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      {dept.bedCount} Inpatient Beds
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2D543E] transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
                    {dept.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                      Marquee Procedures
                    </span>
                    {dept.keyServices.slice(0, 3).map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2D543E]/60 shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    <strong className="text-slate-800">{docCount}</strong> Dedicated Doctors
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenBooking(dept.id)}
                    className="text-xs font-semibold text-[#2D543E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Book Department</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED MEDICAL SPECIALISTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#2D543E]">
              Renowned Medical Leadership
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Consult with Our Senior Specialists
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
              Board-certified practitioners trained at world-leading academic medical institutions, dedicated to clear communication and clinical excellence.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('doctors')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D543E] hover:underline cursor-pointer"
          >
            <span>View All 16 Medical Specialists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={() => onOpenBooking(doctor.departmentId, doctor.id)}
              onViewProfile={onViewDoctorProfile}
            />
          ))}
        </div>
      </section>

      {/* HIGH-FIDELITY CLINICAL FACILITIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-stone-100/80 rounded-3xl p-6 sm:p-10 border border-stone-200 space-y-8">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#2D543E]">
              Hospital Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Purpose-Built for Precision & Patient Comfort
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              From hybrid catheterization suites to garden rehabilitation lounges, every square foot of Medilife General Hospital is designed to accelerate healing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cardiac Suite */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col">
              <div className="relative aspect-16/10 overflow-hidden bg-stone-200">
                <img
                  src={HOSPITAL_IMAGES.cardiacCareSuite}
                  alt="Medilife Advanced Cardiovascular Catheterization Suite"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Biplane Hybrid Cardiovascular Suite
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Facilitates real-time 3D vascular angiography, rapid-access stent deployments, and structural heart replacements with ultra-low radiation dosage.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Wing B · Floor 3</span>
                  <span className="text-[#2D543E] font-medium">Active 24/7</span>
                </div>
              </div>
            </div>

            {/* Rehabilitation Center */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col">
              <div className="relative aspect-16/10 overflow-hidden bg-stone-200">
                <img
                  src={HOSPITAL_IMAGES.rehabilitationCenter}
                  alt="Medilife Panoramic Garden Rehabilitation Lounge"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Garden View Rehabilitation & Recovery Pavilion
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Natural daylight, calming wooden architecture, and specialized physical mobility tracks designed to restore postoperative independence.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Wing C · Floor 2</span>
                  <span className="text-[#2D543E] font-medium">Physical Therapy & Neuro Rehab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED PATIENT STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-[#2D543E]">
            Patient Care Journeys
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Real Stories of Recovery & Compassion
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
            Hear directly from patients whose lives were transformed by Medilife’s multidisciplinary medical teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <blockquote className="text-sm text-stone-700 italic leading-relaxed">
                  "{t.quote}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  {t.patientName}, Age {t.age}
                </h4>
                <div className="text-xs text-stone-500">
                  <span>{t.condition}</span>
                </div>
                <div className="text-xs text-[#2D543E] font-medium">
                  Treated by {t.doctorName} · {t.departmentName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACCREDITATIONS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="border-t border-b border-stone-200 py-10">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Clinical Certifications
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              National & Global Healthcare Accreditations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACCREDITATIONS.map((acc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2D543E]" />
                  <h4 className="font-bold text-slate-900 text-xs">
                    {acc.title}
                  </h4>
                </div>
                <p className="text-xs font-semibold text-[#2D543E]">
                  {acc.subtitle}
                </p>
                <p className="text-[11px] text-stone-500 leading-normal">
                  {acc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL APPOINTMENT REASSURANCE CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#2D543E] to-[#1E3A2B] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              Ready to schedule your medical consultation?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Select your department, pick an available slot, and receive an instant digital admission pass with zero waiting at check-in.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="px-8 py-4 bg-white text-[#2D543E] hover:bg-stone-100 font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer text-center"
            >
              Book an Appointment Now
            </button>
            <a
              href={`tel:${HOSPITAL_CONTACT.appointmentsPhone}`}
              className="px-6 py-4 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-medium text-xs rounded-xl border border-emerald-700/50 transition-colors text-center"
            >
              Phone Desk: {HOSPITAL_CONTACT.appointmentsPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

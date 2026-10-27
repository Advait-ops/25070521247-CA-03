import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  HeartHandshake, 
  Microscope, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Building,
  Users,
  Compass
} from 'lucide-react';
import { ACCREDITATIONS, HOSPITAL_CONTACT, HOSPITAL_IMAGES } from '../../data/hospitalData';
import { PageView } from '../../types';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenBooking,
}) => {
  const leadership = [
    {
      name: 'Dr. Arvind Sharma, MD, MBA',
      role: 'Chief Medical Officer & Executive Director',
      background: 'Former Professor of Surgery at AIIMS New Delhi with over 25 years leading hospital quality and clinical governance.',
      imageFallbackGradient: 'from-emerald-800 to-slate-900',
    },
    {
      name: 'Sunita Deshpande, MSc Nursing, RN',
      role: 'Chief Nursing Officer & Patient Experience Director',
      background: 'Champion of NABH and Magnet-designated nursing standards and patient-to-nurse acuity ratio governance across all inpatient suites.',
      imageFallbackGradient: 'from-teal-700 to-stone-900',
    },
    {
      name: 'Dr. Rajeshwar Patil, MS (Ortho), MCh',
      role: 'Director of Surgical Affairs & Robotic Programs',
      background: 'Pioneer of minimally invasive orthopedic and robotic-assisted surgical protocols with 3,000+ completed procedures.',
      imageFallbackGradient: 'from-stone-700 to-emerald-950',
    },
  ];

  const coreValues = [
    {
      title: 'Evidence-Based Precision',
      description: 'Every diagnostic protocol and treatment regimen is anchored in peer-reviewed clinical guidelines, molecular diagnostics, and audited outcomes.',
      icon: Microscope,
    },
    {
      title: 'Human Compassion & Dignity',
      description: 'We treat the person, not just the diagnosis. From quiet natural healing gardens to dedicated family suites, your comfort is a clinical priority.',
      icon: HeartHandshake,
    },
    {
      title: 'Zero-Delay Emergency Triage',
      description: 'Immediate Level-1 trauma responsiveness, 24/7 cath-lab readiness, and dedicated rapid chest pain and stroke interventions without bureaucratic delays.',
      icon: Clock,
    },
    {
      title: 'Uncompromising Patient Safety',
      description: 'JCI Gold Seal accredited with continuous infection surveillance, surgical checklists, and a 1:3 intensive care nursing ratio.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 max-w-7xl mx-auto px-4 sm:px-8 pt-8">
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D543E] bg-[#2D543E]/10 px-3 py-1 rounded-full">
          <Building className="w-3.5 h-3.5" />
          <span>About Medilife General Hospital · Established 1998</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          A Legacy of Healing Grounded in Human Dignity
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Founded nearly three decades ago with the conviction that tertiary medical care should be as calming and compassionate as it is clinically rigorous, Medilife General Hospital serves as the region’s premier healthcare pavilion.
        </p>
      </div>

      {/* Campus Hero Image Banner */}
      <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-md relative aspect-16/9 md:aspect-21/9 bg-stone-100">
        <img
          src={HOSPITAL_IMAGES.heroLobby}
          alt="Medilife General Hospital Sunlit Reception and Healing Atrium"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 sm:p-10">
          <div className="text-white space-y-1.5 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              The Healing Environment
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display">
              Light-Filled Architectural Spaces Designed to Lower Stress
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Studies prove that natural sunlight, organic timber architecture, and peaceful acoustic zoning directly reduce inpatient recovery times and stress markers.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Founding Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D543E]">
            Our Foundation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built on Medical Excellence and Community Trust
          </h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            Medilife General Hospital was established by a coalition of academic physicians and community healthcare leaders who recognized the need for a modern tertiary institution combining complex surgical capabilities with a reassuring, family-centric ethos.
          </p>
          <p className="text-stone-700 text-sm leading-relaxed">
            Over the past 28 years, Medilife has expanded from a 120-bed community hospital into a 450-bed regional academic affiliate, featuring 6 comprehensive clinical institutes, advanced robotic-arm surgery suites, and a Level-1 trauma center that serves more than 85,000 patients annually.
          </p>
        </div>

        <div className="lg:col-span-6 bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#2D543E]" />
            <span>Our Institutional Charter</span>
          </h3>
          <blockquote className="text-sm text-stone-700 italic border-l-2 border-[#2D543E] pl-4 py-1 leading-relaxed">
            "To safeguard human life through unyielding clinical standards, to alleviate suffering through profound empathy, and to ensure every patient feels heard, respected, and expertly healed."
          </blockquote>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block">Annual Outpatient Visits</span>
              <strong className="text-lg font-bold text-slate-900 font-display">64,000+</strong>
            </div>
            <div>
              <span className="text-stone-500 block">Annual Surgical Operations</span>
              <strong className="text-lg font-bold text-slate-900 font-display">8,200+</strong>
            </div>
            <div>
              <span className="text-stone-500 block">Board-Certified Faculty</span>
              <strong className="text-lg font-bold text-slate-900 font-display">16 Senior Chiefs</strong>
            </div>
            <div>
              <span className="text-stone-500 block">ICU & Critical Care Beds</span>
              <strong className="text-lg font-bold text-slate-900 font-display">78 Private Suites</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Bento Grid */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D543E]">
            Clinical Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            The Pillars of Medilife Care
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2D543E]/10 text-[#2D543E] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {val.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Section */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D543E]">
            Hospital Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Executive Clinical Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((leader, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${leader.imageFallbackGradient} text-white flex items-center justify-center font-display font-bold text-base shadow-xs`}>
                  {leader.name.split(' ').map((n) => n[0]).filter((_, i) => i < 2).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-[#2D543E] font-medium mt-0.5">
                    {leader.role}
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {leader.background}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Accreditations & Honors */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D543E]">
            Verified Quality
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Recognized by Leading Healthcare Regulators
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Our clinical data and surgical recovery statistics are independently audited by national healthcare oversight bodies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACCREDITATIONS.map((acc, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#2D543E]" />
                <h3 className="font-bold text-slate-900 text-sm">{acc.title}</h3>
              </div>
              <p className="text-xs font-semibold text-[#2D543E]">{acc.subtitle}</p>
              <p className="text-xs text-stone-500 leading-relaxed">{acc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visitor Information & Contact Strip */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Campus Location & Visitor Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2D543E]" />
              Campus Address
            </span>
            <p>{HOSPITAL_CONTACT.address}</p>
            <p>{HOSPITAL_CONTACT.cityState}</p>
            <p className="text-stone-400">Underground heated visitor parking available in Garage P1.</p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2D543E]" />
              Visiting Hours
            </span>
            <p>{HOSPITAL_CONTACT.visitingHours}</p>
            <p className="text-stone-400">Quiet hours commence at 09:00 PM to support inpatient rest.</p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">
              Patient Care Navigation
            </span>
            <p>Need directions or special accommodation for elderly or wheelchair access?</p>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-4 py-2 bg-[#2D543E] hover:bg-[#234331] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Book an Outpatient Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

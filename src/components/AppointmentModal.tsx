import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Printer, 
  CheckCircle2, 
  QrCode, 
  Sparkles,
  MapPin,
  DollarSign
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Appointment, Department, Doctor } from '../types';
import { DepartmentIcon } from './DepartmentIcon';
import { useAuth } from '../context/AuthContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDepartmentId?: string;
  initialDoctorId?: string;
  onAppointmentCreated: (appointment: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialDepartmentId,
  initialDoctorId,
  onAppointmentCreated,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(
    initialDepartmentId || DEPARTMENTS[0].id
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient Info State
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other' | 'Prefer not to say'>('Female');
  const [visitReason, setVisitReason] = useState('Routine Medical Consultation');
  const [symptoms, setSymptoms] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Populate from authenticated user profile
  useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName) setPatientName(userProfile.fullName);
      if (userProfile.email) setEmail(userProfile.email);
      if (userProfile.phone) setPhone(userProfile.phone);
      if (userProfile.age) setAge(userProfile.age);
      if (userProfile.gender) setGender(userProfile.gender);
    } else if (currentUser) {
      if (currentUser.displayName) setPatientName(currentUser.displayName);
      if (currentUser.email) setEmail(currentUser.email);
    }
  }, [userProfile, currentUser, isOpen]);

  // Confirmed Appointment pass state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // When initialDepartmentId or initialDoctorId changes upon opening
  useEffect(() => {
    if (isOpen) {
      if (initialDoctorId) {
        const doc = DOCTORS.find((d) => d.id === initialDoctorId);
        if (doc) {
          setSelectedDoctorId(doc.id);
          setSelectedDepartmentId(doc.departmentId);
          setCurrentStep(3); // jump directly to slot picker
        }
      } else if (initialDepartmentId) {
        setSelectedDepartmentId(initialDepartmentId);
        // default to first doctor in that dept
        const firstDoc = DOCTORS.find((d) => d.departmentId === initialDepartmentId);
        if (firstDoc) setSelectedDoctorId(firstDoc.id);
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [isOpen, initialDepartmentId, initialDoctorId]);

  if (!isOpen) return null;

  const currentDepartment: Department =
    DEPARTMENTS.find((d) => d.id === selectedDepartmentId) || DEPARTMENTS[0];

  const availableDoctors: Doctor[] = DOCTORS.filter(
    (d) => d.departmentId === selectedDepartmentId
  );

  const currentDoctor: Doctor | undefined =
    DOCTORS.find((d) => d.id === selectedDoctorId) || availableDoctors[0];

  // Generate next 10 upcoming consultation dates
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 12; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      // If doctor is selected, check if day matches available days
      const isAvailable = currentDoctor
        ? currentDoctor.availableDays.includes(dayName)
        : d.getDay() !== 0; // default exclude Sunday
      dates.push({
        dateString: d.toISOString().split('T')[0],
        dayName,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDisplay: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        isAvailable,
      });
    }
    return dates;
  };

  const upcomingDates = generateAvailableDates();

  // Validate Step 4
  const validatePatientForm = () => {
    const errors: { [key: string]: string } = {};
    if (!patientName.trim()) errors.patientName = 'Patient full name is required';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email address is required';
    if (!phone.trim() || phone.length < 7) errors.phone = 'Valid phone number is required';
    if (!age || age < 1 || age > 120) errors.age = 'Please enter a valid age';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = () => {
    if (!validatePatientForm()) return;
    if (!currentDoctor) return;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const confirmationCode = `MED-${randomSuffix}`;

    const newAppointment: Appointment = {
      id: confirmationCode,
      userId: currentUser?.uid,
      confirmationCode,
      patientName: patientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      age: Number(age),
      gender,
      departmentId: currentDepartment.id,
      departmentName: currentDepartment.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.specialty,
      date: selectedDate || upcomingDates.find((d) => d.isAvailable)?.dateString || '2026-10-30',
      timeSlot: selectedTimeSlot || currentDoctor.availableSlots[0] || '10:00 AM',
      visitReason,
      symptoms: symptoms.trim() || undefined,
      roomNumber: currentDoctor.roomNumber,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setConfirmedAppointment(newAppointment);
    onAppointmentCreated(newAppointment);
    setCurrentStep(5);
  };

  // Download .ics calendar file
  const handleDownloadCalendar = () => {
    if (!confirmedAppointment) return;
    const { doctorName, departmentName, roomNumber, date, timeSlot, confirmationCode } = confirmedAppointment;
    
    // Construct simple ICS
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Medilife General Hospital//Appointments//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Medical Appointment with ${doctorName}`,
      `DESCRIPTION:Appointment Confirmation #${confirmationCode} for ${departmentName} at Medilife General Hospital. Room: ${roomNumber}.`,
      `LOCATION:Medilife General Hospital, ${roomNumber}, 742 Healthcare Parkway`,
      `DTSTART:${date.replace(/-/g, '')}T090000Z`,
      `DTEND:${date.replace(/-/g, '')}T100000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Medilife-Appointment-${confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2D543E]">
                Medilife Patient Access
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                {currentStep < 5 ? `Step ${currentStep} of 4` : 'Digital Pass'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {currentStep === 1 && 'Select Clinical Department'}
              {currentStep === 2 && 'Select Medical Specialist'}
              {currentStep === 3 && 'Choose Date & Consultation Slot'}
              {currentStep === 4 && 'Patient Information & Intake'}
              {currentStep === 5 && 'Appointment Confirmed'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-slate-800 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        {currentStep < 5 && (
          <div className="grid grid-cols-4 bg-stone-100 h-1.5 shrink-0">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full transition-all duration-300 ${
                  currentStep >= step ? 'bg-[#2D543E]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: DEPARTMENT SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                Please select the specialized department matching your care needs. Each department provides dedicated diagnostic suites and outpatient physicians.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDepartmentId === dept.id;
                  const deptDocCount = DOCTORS.filter((d) => d.departmentId === dept.id).length;
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => {
                        setSelectedDepartmentId(dept.id);
                        // Pick first doctor of department
                        const firstDoc = DOCTORS.find((d) => d.departmentId === dept.id);
                        if (firstDoc) setSelectedDoctorId(firstDoc.id);
                      }}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2D543E] bg-[#2D543E]/5 ring-1 ring-[#2D543E]'
                          : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2.5 rounded-lg shrink-0 ${
                            isSelected
                              ? 'bg-[#2D543E] text-white'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          <DepartmentIcon name={dept.iconName} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-base leading-snug">
                            {dept.name}
                          </h3>
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                            {dept.tagline}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                        <span>{dept.floorLocation}</span>
                        <span className="font-medium text-[#2D543E]">
                          {deptDocCount} Specialists
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DOCTOR SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                    {currentDepartment.name}
                  </span>
                  <p className="text-sm text-stone-600">
                    Select one of our board-certified physicians for your consultation:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {availableDoctors.map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#2D543E] bg-[#2D543E]/5 ring-1 ring-[#2D543E]'
                          : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doc.imageFallbackGradient} text-white flex items-center justify-center font-display font-semibold text-lg shrink-0 shadow-xs`}>
                          {doc.name.split(' ').map((n) => n[0]).filter((_, i) => i < 2).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900 text-base">
                              {doc.name}
                            </h4>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#2D543E]" />
                            )}
                          </div>
                          <p className="text-xs text-stone-600 font-medium">
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                            <span>{doc.experienceYears} Years Exp</span>
                            <span aria-hidden="true">·</span>
                            <span>{doc.languages.join(', ')}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#2D543E] font-medium">{doc.roomNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-right shrink-0 flex sm:flex-col justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                        <span className="text-xs text-stone-500">Standard Intake</span>
                        <span className="font-display font-bold text-slate-900 text-base">
                          {doc.consultationFee}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SLOT SELECTION */}
          {currentStep === 3 && currentDoctor && (
            <div className="space-y-6">
              {/* Doctor Summary Header */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentDoctor.imageFallbackGradient} text-white flex items-center justify-center font-display font-bold text-sm`}>
                    {currentDoctor.name.split(' ').map((n) => n[0]).filter((_, i) => i < 2).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{currentDoctor.name}</h4>
                    <p className="text-xs text-stone-500">{currentDoctor.specialty} · {currentDoctor.roomNumber}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#2D543E] hover:underline font-medium"
                >
                  Change Doctor
                </button>
              </div>

              {/* 1. Date Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2.5">
                  1. Select Consultation Date
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {upcomingDates.slice(0, 8).map((dateObj) => {
                    const isSelected = selectedDate === dateObj.dateString;
                    return (
                      <button
                        key={dateObj.dateString}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateObj.dateString);
                          if (!selectedTimeSlot && currentDoctor.availableSlots.length > 0) {
                            setSelectedTimeSlot(currentDoctor.availableSlots[0]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                          isSelected
                            ? 'border-[#2D543E] bg-[#2D543E] text-white shadow-xs'
                            : 'border-stone-200 bg-white text-slate-800 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <span className={`text-[11px] uppercase tracking-wider ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                          {dateObj.dayName.slice(0, 3)}
                        </span>
                        <span className="text-base font-bold my-0.5">
                          {dateObj.displayDate}
                        </span>
                        <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                          {dateObj.isAvailable ? 'Regular Hours' : 'On-Call'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Slot Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2.5">
                  2. Select Consultation Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {currentDoctor.availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-3 px-2 rounded-xl border text-center text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-[#2D543E] bg-[#2D543E] text-white shadow-xs'
                            : 'border-stone-200 bg-white text-slate-800 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`} />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2D543E] shrink-0" />
                <span>
                  Consultation will take place in <strong>{currentDoctor.roomNumber}</strong>, Medilife General Hospital, 742 Healthcare Parkway.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: PATIENT DETAILS INTAKE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                Please enter the patient’s contact details. A confirmation reference code and digital pass will be issued immediately upon submission.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E] ${
                      formErrors.patientName ? 'border-red-500' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.patientName && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.patientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah.jenkins@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E] ${
                      formErrors.email ? 'border-red-500' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (555) 234-5678"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E] ${
                      formErrors.phone ? 'border-red-500' : 'border-stone-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Reason for Visit
                </label>
                <select
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                >
                  <option value="Initial Consultation & Evaluation">Initial Consultation & Evaluation</option>
                  <option value="Routine Follow-up Check">Routine Follow-up Check</option>
                  <option value="Second Opinion on Diagnosis">Second Opinion on Diagnosis</option>
                  <option value="Post-Procedure Assessment">Post-Procedure Assessment</option>
                  <option value="Diagnostic Review / Lab Results">Diagnostic Review / Lab Results</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Brief Medical Notes or Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe any current symptoms, allergies, or previous treatments..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D543E]"
                />
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2D543E] shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Waiting Guarantee:</strong> Please arrive 10 minutes prior to your slot time. Our admissions desk will immediately verify your digital pass.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: DIGITAL CONFIRMATION PASS */}
          {currentStep === 5 && confirmedAppointment && (
            <div className="space-y-6">
              {/* Top Success Badge */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-[#2D543E] rounded-full mb-1">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  Appointment Confirmed!
                </h3>
                <p className="text-sm text-stone-600">
                  Your appointment has been registered in the Medilife admissions queue.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-gradient-to-b from-stone-50 to-white rounded-2xl border-2 border-[#2D543E]/20 shadow-sm overflow-hidden p-6 relative">
                {/* Decorative Pass Top Edge */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2D543E] text-white flex items-center justify-center font-bold text-xs">
                      M
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Medilife General Hospital</span>
                      <span className="text-[11px] text-stone-500 block">Outpatient Admission Pass</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Reference Code</span>
                    <span className="font-mono font-bold text-[#2D543E] text-lg tabular-nums">
                      {confirmedAppointment.confirmationCode}
                    </span>
                  </div>
                </div>

                {/* Pass Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-sm border-b border-stone-200">
                  <div>
                    <span className="text-xs text-stone-500 block">Patient Name</span>
                    <span className="font-semibold text-slate-900 text-base">
                      {confirmedAppointment.patientName}
                    </span>
                    <span className="text-xs text-stone-500 block mt-0.5">
                      Age {confirmedAppointment.age} · {confirmedAppointment.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">Consulting Physician</span>
                    <span className="font-semibold text-slate-900 text-base">
                      {confirmedAppointment.doctorName}
                    </span>
                    <span className="text-xs text-[#2D543E] font-medium block mt-0.5">
                      {confirmedAppointment.doctorSpecialty}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">Scheduled Date & Time</span>
                    <span className="font-semibold text-slate-900">
                      {confirmedAppointment.date}
                    </span>
                    <span className="text-xs font-bold text-stone-700 block">
                      {confirmedAppointment.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-500 block">Department & Location</span>
                    <span className="font-semibold text-slate-900">
                      {confirmedAppointment.departmentName}
                    </span>
                    <span className="text-xs text-stone-600 block">
                      {confirmedAppointment.roomNumber}
                    </span>
                  </div>
                </div>

                {/* QR Code and verification strip */}
                <div className="pt-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-800 block">
                      Arrival Instructions
                    </span>
                    <p className="text-xs text-stone-500">
                      Present this digital pass or mention code <span className="font-mono font-bold text-slate-800">{confirmedAppointment.confirmationCode}</span> at the main lobby reception kiosk upon entry.
                    </p>
                  </div>
                  {/* Visual QR Code preview */}
                  <div className="p-2 bg-white rounded-xl border border-stone-200 shrink-0 shadow-xs flex flex-col items-center">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <span className="text-[9px] font-mono text-stone-400 mt-0.5">SCAN ADMIT</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-stone-500" />
                  <span>Add to Calendar (.ics)</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-stone-500" />
                  <span>Print Pass</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-t border-stone-200 shrink-0">
          {currentStep === 1 ? (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-stone-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
            >
              Cancel
            </button>
          ) : currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-slate-900 px-3 py-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                // Reset to book another if requested
                setCurrentStep(1);
                setConfirmedAppointment(null);
              }}
              className="text-xs font-medium text-stone-600 hover:text-slate-900 cursor-pointer"
            >
              Schedule Another
            </button>
          )}

          {currentStep < 3 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors cursor-pointer shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={() => {
                if (!selectedDate && upcomingDates.length > 0) {
                  setSelectedDate(upcomingDates[0].dateString);
                }
                if (!selectedTimeSlot && currentDoctor) {
                  setSelectedTimeSlot(currentDoctor.availableSlots[0]);
                }
                setCurrentStep(4);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors cursor-pointer shadow-xs"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 4 && (
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Issue Pass</span>
            </button>
          )}

          {currentStep === 5 && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2D543E] rounded-xl hover:bg-[#234331] transition-colors cursor-pointer shadow-xs"
            >
              Done & Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

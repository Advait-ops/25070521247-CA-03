import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  Stethoscope, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Download, 
  Printer, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  FileText, 
  Phone, 
  Mail, 
  DollarSign, 
  UserCheck, 
  Plus, 
  X,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';
import { Appointment, Doctor } from '../types';
import { DEPARTMENTS } from '../data/hospitalData';
import { useDoctors } from '../context/DoctorContext';
import { 
  fetchAllAppointmentsAdmin, 
  updateMongoAppointment, 
  deleteMongoAppointment, 
  checkMongoStatus, 
  MongoStatus 
} from '../services/mongoAppointmentService';
import { fetchAdminOverview } from '../services/doctorService';
import { useAuth } from '../context/AuthContext';

export const AdminPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const { doctors, addDoctor, editDoctor, removeDoctor, toggleDoctorDuty, refreshDoctors } = useDoctors();

  // Navigation tabs within Admin Portal
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'analytics' | 'hospital_settings'>('appointments');

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [mongoStatus, setMongoStatus] = useState<MongoStatus | null>(null);

  // Filters for appointments
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Selected appointment for details / action / print
  const [selectedAppointmentForPrint, setSelectedAppointmentForPrint] = useState<Appointment | null>(null);
  const [reassigningAppointment, setReassigningAppointment] = useState<Appointment | null>(null);
  const [selectedReassignDoctorId, setSelectedReassignDoctorId] = useState('');
  const [editingNotesAppointment, setEditingNotesAppointment] = useState<Appointment | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Appointment Deletion State
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeletingAppointment, setIsDeletingAppointment] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Doctor Management Modal State
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  // New Doctor Form State
  const [newDoctorForm, setNewDoctorForm] = useState({
    name: '',
    title: 'Consultant Specialist',
    departmentId: DEPARTMENTS[0].id,
    specialty: '',
    qualifications: 'MBBS, MD',
    experienceYears: 10,
    languages: 'English, Hindi',
    consultationFee: '₹1,200',
    roomNumber: 'OPD Suite 201',
    bio: '',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    status: 'available' as 'available' | 'on_leave' | 'emergency_only',
  });

  // Doctor Filter State
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorDeptFilter, setDoctorDeptFilter] = useState('all');

  // Overview stats
  const [overviewStats, setOverviewStats] = useState<any>(null);

  // Load appointments and status
  const loadAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const data = await fetchAllAppointmentsAdmin();
      setAppointments(data);
    } catch (e) {
      console.error('Failed to load appointments:', e);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const loadStatusAndOverview = async () => {
    const status = await checkMongoStatus();
    setMongoStatus(status);
    const overview = await fetchAdminOverview();
    if (overview) setOverviewStats(overview);
  };

  useEffect(() => {
    loadAppointments();
    loadStatusAndOverview();
  }, []);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      if (deptFilter !== 'all' && apt.departmentId !== deptFilter) return false;
      if (doctorFilter !== 'all' && apt.doctorId !== doctorFilter) return false;
      if (dateFilter && apt.date !== dateFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPatient = apt.patientName?.toLowerCase().includes(q);
        const matchesPhone = apt.phone?.toLowerCase().includes(q);
        const matchesEmail = apt.email?.toLowerCase().includes(q);
        const matchesCode = apt.confirmationCode?.toLowerCase().includes(q);
        const matchesDoctor = apt.doctorName?.toLowerCase().includes(q);
        const matchesReason = apt.visitReason?.toLowerCase().includes(q);
        return matchesPatient || matchesPhone || matchesEmail || matchesCode || matchesDoctor || matchesReason;
      }
      return true;
    });
  }, [appointments, statusFilter, deptFilter, doctorFilter, dateFilter, searchQuery]);

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (doctorDeptFilter !== 'all' && doc.departmentId !== doctorDeptFilter) return false;
      if (doctorSearchQuery.trim()) {
        const q = doctorSearchQuery.toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.departmentName.toLowerCase().includes(q) ||
          doc.roomNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [doctors, doctorDeptFilter, doctorSearchQuery]);

  // Appointment Status Updater
  const handleUpdateStatus = async (
    id: string, 
    newStatus: 'Confirmed' | 'In-Consultation' | 'Completed' | 'Cancelled' | 'Rescheduled'
  ) => {
    const success = await updateMongoAppointment(id, { status: newStatus });
    if (success) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      loadStatusAndOverview();
    }
  };

  // Reassign Doctor Handler
  const handleConfirmReassign = async () => {
    if (!reassigningAppointment || !selectedReassignDoctorId) return;
    const targetDoctor = doctors.find((d) => d.id === selectedReassignDoctorId);
    if (!targetDoctor) return;

    const updates = {
      doctorId: targetDoctor.id,
      doctorName: targetDoctor.name,
      doctorSpecialty: targetDoctor.specialty,
      departmentId: targetDoctor.departmentId,
      departmentName: targetDoctor.departmentName,
      roomNumber: targetDoctor.roomNumber,
    };

    const success = await updateMongoAppointment(reassigningAppointment.id, updates);
    if (success) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === reassigningAppointment.id ? { ...a, ...updates } : a
        )
      );
      setReassigningAppointment(null);
      setSelectedReassignDoctorId('');
      setActionFeedback({
        message: `Doctor successfully reassigned to ${targetDoctor.name} (${targetDoctor.roomNumber})`,
        type: 'success',
      });
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Save Clinical / Admin Notes
  const handleSaveNotes = async () => {
    if (!editingNotesAppointment) return;
    const success = await updateMongoAppointment(editingNotesAppointment.id, {
      adminNotes: tempNotes,
    });
    if (success) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingNotesAppointment.id ? { ...a, adminNotes: tempNotes } : a
        )
      );
      setEditingNotesAppointment(null);
      setActionFeedback({
        message: 'Clinical notes saved successfully to MongoDB.',
        type: 'success',
      });
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  // Delete Appointment Trigger Modal
  const handleDeleteAppointment = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
  };

  // Confirm Delete Appointment from MongoDB
  const handleConfirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    setIsDeletingAppointment(true);
    try {
      const id = appointmentToDelete.id;
      const success = await deleteMongoAppointment(id);
      if (success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id && a.confirmationCode !== id));
        loadStatusAndOverview();
        setActionFeedback({
          message: `Appointment for ${appointmentToDelete.patientName} (${appointmentToDelete.confirmationCode || appointmentToDelete.id}) permanently deleted from MongoDB Atlas.`,
          type: 'success',
        });
        setTimeout(() => setActionFeedback(null), 5000);
      } else {
        setActionFeedback({
          message: 'Failed to delete appointment from MongoDB backend.',
          type: 'error',
        });
        setTimeout(() => setActionFeedback(null), 5000);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setActionFeedback({
        message: `Error deleting appointment: ${err.message || 'Network error'}`,
        type: 'error',
      });
      setTimeout(() => setActionFeedback(null), 5000);
    } finally {
      setIsDeletingAppointment(false);
      setAppointmentToDelete(null);
    }
  };

  // Add New Doctor Submit
  const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorForm.name.trim()) {
      setActionFeedback({ message: 'Doctor full name is required', type: 'error' });
      setTimeout(() => setActionFeedback(null), 4000);
      return;
    }

    const dept = DEPARTMENTS.find((d) => d.id === newDoctorForm.departmentId);

    const doctorPayload: Partial<Doctor> = {
      name: newDoctorForm.name.trim(),
      title: newDoctorForm.title.trim(),
      departmentId: newDoctorForm.departmentId,
      departmentName: dept?.name || 'General Medicine',
      specialty: newDoctorForm.specialty.trim() || `${dept?.name || 'Specialist'} Care`,
      qualifications: newDoctorForm.qualifications.trim(),
      experienceYears: Number(newDoctorForm.experienceYears) || 5,
      languages: newDoctorForm.languages.split(',').map((l) => l.trim()).filter(Boolean),
      consultationFee: newDoctorForm.consultationFee.trim().startsWith('₹') ? newDoctorForm.consultationFee.trim() : `₹${newDoctorForm.consultationFee.trim()}`,
      roomNumber: newDoctorForm.roomNumber.trim(),
      bio: newDoctorForm.bio.trim() || `Consultant at Medilife General Hospital specializing in ${newDoctorForm.specialty}.`,
      availableDays: newDoctorForm.availableDays,
      availableSlots: newDoctorForm.availableSlots,
      status: newDoctorForm.status,
      rating: 4.9,
      reviewCount: 12,
      education: ['Renowned Medical Institute (MBBS, MD)'],
      memberships: ['Indian Medical Association (IMA)'],
      imageFallbackGradient: 'from-emerald-700 to-teal-950',
    };

    const res = await addDoctor(doctorPayload);
    if (res) {
      setActionFeedback({
        message: `Dr. ${doctorPayload.name} has been added successfully! They are now live on the booking page.`,
        type: 'success',
      });
      setTimeout(() => setActionFeedback(null), 5000);
      setIsAddDoctorModalOpen(false);
      setNewDoctorForm({
        name: '',
        title: 'Consultant Specialist',
        departmentId: DEPARTMENTS[0].id,
        specialty: '',
        qualifications: 'MBBS, MD',
        experienceYears: 10,
        languages: 'English, Hindi',
        consultationFee: '₹1,200',
        roomNumber: 'OPD Suite 201',
        bio: '',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
        status: 'available',
      });
      loadStatusAndOverview();
    }
  };

  // Remove Doctor Handler
  const handleConfirmDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    const res = await removeDoctor(doctorToDelete.id);
    if (res) {
      setActionFeedback({
        message: `Dr. ${doctorToDelete.name} has been removed from the hospital roster and patient booking directory.`,
        type: 'success',
      });
      setTimeout(() => setActionFeedback(null), 5000);
      setDoctorToDelete(null);
      loadStatusAndOverview();
    }
  };

  // Export Appointments to CSV
  const handleExportCSV = () => {
    if (appointments.length === 0) {
      setActionFeedback({ message: 'No appointments to export.', type: 'error' });
      setTimeout(() => setActionFeedback(null), 4000);
      return;
    }

    const headers = [
      'Appointment ID',
      'Confirmation Code',
      'Patient Name',
      'Age',
      'Gender',
      'Phone',
      'Email',
      'Department',
      'Doctor Name',
      'Room Number',
      'Date',
      'Time Slot',
      'Status',
      'Reason for Visit',
      'Admin Notes',
      'Created At',
    ];

    const rows = appointments.map((a) => [
      `"${a.id}"`,
      `"${a.confirmationCode || ''}"`,
      `"${a.patientName}"`,
      a.age,
      `"${a.gender}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.departmentName}"`,
      `"${a.doctorName}"`,
      `"${a.roomNumber}"`,
      `"${a.date}"`,
      `"${a.timeSlot}"`,
      `"${a.status}"`,
      `"${(a.visitReason || '').replace(/"/g, '""')}"`,
      `"${(a.adminNotes || '').replace(/"/g, '""')}"`,
      `"${a.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medilife_appointments_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter((a) => a.date === todayStr || (a.createdAt && a.createdAt.startsWith(todayStr))).length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const inConsultCount = appointments.filter((a) => a.status === 'In-Consultation').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const activeDoctorsCount = doctors.filter((d) => d.status !== 'on_leave').length;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Admin Header Bar */}
      <div className="bg-[#1E3A2B] text-white border-b border-emerald-950 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-lg">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Medilife Hospital Command & Admin Portal
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-md uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80">
                  Logged in as <span className="font-mono text-white font-medium">{currentUser?.email || 'Hospital Administrator'}</span> · Full privileges for appointments & medical staff roster
                </p>
              </div>
            </div>

            {/* Live MongoDB Status & Quick Refresh */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/40 rounded-lg text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-200">MongoDB Atlas:</span>
                <span className="font-mono text-emerald-100 font-medium">medilife_hospital</span>
              </div>
              <button
                onClick={() => {
                  loadAppointments();
                  loadStatusAndOverview();
                  refreshDoctors();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
                title="Refresh from MongoDB"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-emerald-900/60">
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
              <div className="text-[11px] font-medium text-emerald-200/80">Total Appointments</div>
              <div className="text-xl font-bold text-white mt-1">{appointments.length}</div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
              <div className="text-[11px] font-medium text-emerald-200/80">Today's Footfall</div>
              <div className="text-xl font-bold text-emerald-300 mt-1">{todayCount}</div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
              <div className="text-[11px] font-medium text-emerald-200/80">Confirmed / Scheduled</div>
              <div className="text-xl font-bold text-cyan-300 mt-1">{confirmedCount}</div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
              <div className="text-[11px] font-medium text-emerald-200/80">In Consultation</div>
              <div className="text-xl font-bold text-amber-300 mt-1">{inConsultCount}</div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
              <div className="text-[11px] font-medium text-emerald-200/80">Completed OPDs</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{completedCount}</div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
              <div className="text-[11px] font-medium text-emerald-200/80">Active Doctors on Duty</div>
              <div className="text-xl font-bold text-white mt-1">
                {activeDoctorsCount} <span className="text-xs text-stone-400 font-normal">/ {doctors.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 border-t border-emerald-900/60 flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-3 px-4 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'appointments'
                ? 'border-emerald-400 text-white bg-emerald-900/30'
                : 'border-transparent text-emerald-200/70 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>All Appointments ({appointments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-3 px-4 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'doctors'
                ? 'border-emerald-400 text-white bg-emerald-900/30'
                : 'border-transparent text-emerald-200/70 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors Roster & Management ({doctors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'border-emerald-400 text-white bg-emerald-900/30'
                : 'border-transparent text-emerald-200/70 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Hospital Department Analytics</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {actionFeedback && (
          <div
            className={`mb-5 p-4 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200 ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{actionFeedback.message}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: ALL APPOINTMENTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-5">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient, phone, code (e.g. MED-...), doctor or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E] focus:ring-1 focus:ring-[#2D543E]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-[#2D543E]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In-Consultation">In-Consultation</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>

                {/* Department Filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-[#2D543E]"
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                {/* Doctor Filter */}
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-[#2D543E]"
                >
                  <option value="all">All Doctors</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#2D543E]"
                  title="Filter by appointment date"
                />

                {(searchQuery || statusFilter !== 'all' || deptFilter !== 'all' || doctorFilter !== 'all' || dateFilter) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDeptFilter('all');
                      setDoctorFilter('all');
                      setDateFilter('');
                    }}
                    className="px-2.5 py-2 text-xs text-stone-500 hover:text-stone-800 bg-stone-100 rounded-xl"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Table or Empty State */}
            {isLoadingAppointments ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <RefreshCw className="w-8 h-8 text-[#2D543E] animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">Loading master appointment ledger from MongoDB Atlas...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800">No appointments found</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  There are no appointments matching your current search or filters. You can clear filters or patients can book from the website.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Code / ID</th>
                        <th className="py-3.5 px-4">Patient Details</th>
                        <th className="py-3.5 px-4">Department & Doctor</th>
                        <th className="py-3.5 px-4">Date & Slot</th>
                        <th className="py-3.5 px-4">OPD Room</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Clinical / OPD Notes</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-slate-700">
                      {filteredAppointments.map((apt) => {
                        const statusColors: { [key: string]: string } = {
                          Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          'In-Consultation': 'bg-amber-50 text-amber-700 border-amber-200',
                          Completed: 'bg-blue-50 text-blue-700 border-blue-200',
                          Cancelled: 'bg-red-50 text-red-700 border-red-200',
                          Rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
                        };

                        return (
                          <tr key={apt.id} className="hover:bg-stone-50/70 transition-colors">
                            {/* Confirmation Code */}
                            <td className="py-3 px-4 font-mono font-medium">
                              <span className="text-[#2D543E] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold block whitespace-nowrap">
                                {apt.confirmationCode || apt.id.substring(0, 8)}
                              </span>
                              <span className="text-[10px] text-stone-400 block mt-0.5">
                                {new Date(apt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>

                            {/* Patient Info */}
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">{apt.patientName}</div>
                              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                                <span>{apt.gender}, {apt.age}y</span>
                                <span>·</span>
                                <span className="font-mono">{apt.phone}</span>
                              </div>
                              <div className="text-[10px] text-stone-400 truncate max-w-[140px]">{apt.email}</div>
                            </td>

                            {/* Department & Doctor */}
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                                <Stethoscope className="w-3.5 h-3.5 text-[#2D543E]" />
                                <span>{apt.doctorName}</span>
                              </div>
                              <div className="text-[11px] text-[#2D543E] font-medium">{apt.departmentName}</div>
                              <div className="text-[10px] text-stone-400 italic truncate max-w-[160px]">
                                {apt.visitReason}
                              </div>
                            </td>

                            {/* Date & Time Slot */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-semibold text-slate-800 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                <span>{apt.date}</span>
                              </div>
                              <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-stone-400" />
                                <span>{apt.timeSlot}</span>
                              </div>
                            </td>

                            {/* OPD Room */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-stone-100 rounded text-slate-800 border border-stone-200">
                                {apt.roomNumber || 'Room 101'}
                              </span>
                            </td>

                            {/* Status Changer */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <select
                                value={apt.status}
                                onChange={(e) => handleUpdateStatus(apt.id, e.target.value as any)}
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                                  statusColors[apt.status] || 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="In-Consultation">In-Consultation</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rescheduled">Rescheduled</option>
                              </select>
                            </td>

                            {/* Notes */}
                            <td className="py-3 px-4 max-w-[150px]">
                              {apt.adminNotes ? (
                                <button
                                  onClick={() => {
                                    setEditingNotesAppointment(apt);
                                    setTempNotes(apt.adminNotes || '');
                                  }}
                                  className="text-[11px] text-stone-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded block truncate text-left w-full"
                                  title={apt.adminNotes}
                                >
                                  {apt.adminNotes}
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingNotesAppointment(apt);
                                    setTempNotes('');
                                  }}
                                  className="text-[10px] text-stone-400 hover:text-[#2D543E] underline flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add OPD note</span>
                                </button>
                              )}
                            </td>

                            {/* Actions: Reassign, Print OPD Slip, Delete */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Reassign Doctor Button */}
                                <button
                                  onClick={() => {
                                    setReassigningAppointment(apt);
                                    setSelectedReassignDoctorId(apt.doctorId);
                                  }}
                                  className="p-1.5 text-stone-600 hover:text-[#2D543E] hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Reassign to another doctor"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>

                                {/* Print OPD Slip Button */}
                                <button
                                  onClick={() => setSelectedAppointmentForPrint(apt)}
                                  className="p-1.5 text-stone-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Print OPD Consultation Slip"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>

                                {/* Delete Patient Appointment Button */}
                                <button
                                  onClick={() => handleDeleteAppointment(apt)}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete patient appointment record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                  <div>
                    Showing <span className="font-semibold text-slate-800">{filteredAppointments.length}</span> of{' '}
                    <span className="font-semibold text-slate-800">{appointments.length}</span> total hospital appointments
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-medium">Synced with MongoDB Atlas</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DOCTORS ROSTER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search doctor by name, specialty, room..."
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>

                <select
                  value={doctorDeptFilter}
                  onChange={(e) => setDoctorDeptFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add New Doctor Button */}
              <button
                onClick={() => setIsAddDoctorModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D543E] hover:bg-[#234331] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New Specialist Doctor</span>
              </button>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doc) => {
                const dutyStatus = doc.status || 'available';
                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Department and Duty Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold text-[#2D543E] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          {doc.departmentName}
                        </span>

                        {/* Duty Status Dropdown */}
                        <select
                          value={dutyStatus}
                          onChange={(e) =>
                            toggleDoctorDuty(doc.id, e.target.value as 'available' | 'on_leave' | 'emergency_only')
                          }
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border cursor-pointer focus:outline-none ${
                            dutyStatus === 'available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : dutyStatus === 'on_leave'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <option value="available">● On Duty</option>
                          <option value="on_leave">● On Leave</option>
                          <option value="emergency_only">● Emergency Only</option>
                        </select>
                      </div>

                      {/* Doctor Name & Title */}
                      <h3 className="font-bold text-slate-900 text-sm">{doc.name}</h3>
                      <p className="text-xs text-stone-500 font-medium">{doc.title}</p>
                      <p className="text-xs text-[#2D543E] font-medium mt-1">{doc.specialty}</p>

                      {/* Credentials */}
                      <div className="text-[11px] text-stone-500 mt-2 line-clamp-2">
                        {doc.qualifications} · {doc.experienceYears} Years Exp.
                      </div>

                      {/* Room & Fee */}
                      <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">OPD Room</span>
                          <span className="font-mono font-semibold text-slate-800">{doc.roomNumber}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Consultation Fee</span>
                          <span className="font-mono font-bold text-emerald-800">{doc.consultationFee}</span>
                        </div>
                      </div>

                      {/* Timings */}
                      <div className="mt-2 text-[11px] text-stone-500">
                        <span className="text-stone-400 block text-[10px] uppercase">Available Days</span>
                        <span className="text-slate-700">{doc.availableDays.join(', ')}</span>
                      </div>
                    </div>

                    {/* Bottom Actions: Edit Fee/Room & Delete */}
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const newFee = prompt(`Update consultation fee for ${doc.name}:`, doc.consultationFee);
                          if (newFee) {
                            editDoctor(doc.id, { consultationFee: newFee });
                          }
                        }}
                        className="text-xs text-stone-600 hover:text-[#2D543E] font-medium flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Fee / Room</span>
                      </button>

                      <button
                        onClick={() => setDoctorToDelete(doc)}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center gap-1"
                        title="Remove doctor from hospital and booking directory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: HOSPITAL ANALYTICS & LOAD */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Revenue */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Estimated OPD Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono">
                  ₹{overviewStats?.totalRevenue ? overviewStats.totalRevenue.toLocaleString('en-IN') : '0'}
                </div>
                <p className="text-xs text-stone-400 mt-2">
                  Calculated from scheduled active patient consultations
                </p>
              </div>

              {/* Card 2: Consultation Volume */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Consultation Completion Rate</span>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono">
                  {appointments.length > 0
                    ? Math.round((completedCount / appointments.length) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-stone-400 mt-2">
                  {completedCount} completed of {appointments.length} total bookings
                </p>
              </div>

              {/* Card 3: Database Engine */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Storage Engine</span>
                  <Database className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700 font-mono">
                  MongoDB Atlas
                </div>
                <p className="text-xs text-stone-400 mt-2 truncate">
                  Cluster: cluster0.rej88yl.mongodb.net
                </p>
              </div>
            </div>

            {/* Department-wise load chart */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Department Patient Consultation Load</h3>
              <div className="space-y-4">
                {DEPARTMENTS.map((dept) => {
                  const deptAppointments = appointments.filter((a) => a.departmentId === dept.id);
                  const deptDoctors = doctors.filter((d) => d.departmentId === dept.id);
                  const percentage = appointments.length > 0 ? (deptAppointments.length / appointments.length) * 100 : 0;

                  return (
                    <div key={dept.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800">{dept.name}</span>
                        <span className="text-stone-500">
                          <strong className="text-slate-900">{deptAppointments.length}</strong> appointments · {deptDoctors.length} doctors
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#2D543E] h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD NEW SPECIALIST DOCTOR */}
      {/* ========================================================= */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2D543E] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add New Specialist Doctor</h3>
                  <p className="text-xs text-stone-500">Will immediately appear on booking page and doctor directory</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Sharma, MD"
                    value={newDoctorForm.name}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Consultant"
                    value={newDoctorForm.title}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={newDoctorForm.departmentId}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-Specialty Focus</label>
                  <input
                    type="text"
                    placeholder="e.g. Pediatric Cardiology, Spine Rehab"
                    value={newDoctorForm.specialty}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD, DM"
                    value={newDoctorForm.qualifications}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, qualifications: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newDoctorForm.experienceYears}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Fee</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,200"
                    value={newDoctorForm.consultationFee}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, consultationFee: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">OPD Room / Suite</label>
                  <input
                    type="text"
                    placeholder="e.g. OPD Wing B, Room 204"
                    value={newDoctorForm.roomNumber}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    placeholder="e.g. English, Hindi, Marathi"
                    value={newDoctorForm.languages}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, languages: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Bio & Clinical Focus</label>
                <textarea
                  rows={2}
                  placeholder="Short description of doctor's clinical background and approach..."
                  value={newDoctorForm.bio}
                  onChange={(e) => setNewDoctorForm({ ...newDoctorForm, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#2D543E] hover:bg-[#234331] rounded-xl shadow-xs transition-colors"
                >
                  Save & Publish Doctor to MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REASSIGN DOCTOR TO APPOINTMENT */}
      {/* ========================================================= */}
      {reassigningAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#2D543E]" />
                <h3 className="font-bold text-slate-900 text-sm">Reassign Appointment Doctor</h3>
              </div>
              <button
                onClick={() => setReassigningAppointment(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="text-stone-500">Patient:</div>
                <div className="font-bold text-slate-900">{reassigningAppointment.patientName}</div>
                <div className="text-stone-500 mt-1">Current Doctor:</div>
                <div className="font-medium text-[#2D543E]">{reassigningAppointment.doctorName} ({reassigningAppointment.departmentName})</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Select New Doctor:</label>
                <select
                  value={selectedReassignDoctorId}
                  onChange={(e) => setSelectedReassignDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-[#2D543E]"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.departmentName} ({d.roomNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setReassigningAppointment(null)}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassign}
                disabled={!selectedReassignDoctorId}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2D543E] hover:bg-[#234331] rounded-xl disabled:opacity-50 transition-colors"
              >
                Confirm Doctor Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT CLINICAL / OPD NOTES */}
      {/* ========================================================= */}
      {editingNotesAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-slate-900 text-sm">Clinical / Administrative Notes</h3>
              <button onClick={() => setEditingNotesAppointment(null)} className="p-1 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="text-xs text-stone-500">
                Appointment with <strong className="text-slate-800">{editingNotesAppointment.patientName}</strong> ({editingNotesAppointment.confirmationCode})
              </div>
              <textarea
                rows={4}
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Enter doctor's prescription remarks, OPD token number, triage priority or follow-up instructions..."
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#2D543E]"
              />
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingNotesAppointment(null)}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2D543E] hover:bg-[#234331] rounded-xl"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REMOVE DOCTOR CONFIRMATION */}
      {/* ========================================================= */}
      {doctorToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 text-base">Remove Doctor from Roster?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{doctorToDelete.name}</strong> ({doctorToDelete.departmentName})?
              This will immediately remove them from the patient appointment booking system and the doctor directory.
            </p>
            <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setDoctorToDelete(null)}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteDoctor}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer"
              >
                Yes, Remove Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE APPOINTMENT / CLIENT RECORD */}
      {/* ========================================================= */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Patient Record?</h3>
                <p className="text-[11px] text-stone-500">Permanent removal from MongoDB database</p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 my-3">
              <div>
                <span className="text-stone-400">Patient:</span> <strong className="text-slate-900">{appointmentToDelete.patientName}</strong> ({appointmentToDelete.age}y, {appointmentToDelete.gender})
              </div>
              <div>
                <span className="text-stone-400">Booking Pass:</span> <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{appointmentToDelete.confirmationCode || appointmentToDelete.id}</span>
              </div>
              <div>
                <span className="text-stone-400">Doctor:</span> <span className="font-medium text-slate-800">{appointmentToDelete.doctorName}</span> ({appointmentToDelete.departmentName})
              </div>
              <div>
                <span className="text-stone-400">Scheduled:</span> <span className="font-medium text-slate-800">{appointmentToDelete.date} at {appointmentToDelete.timeSlot}</span>
              </div>
              <div>
                <span className="text-stone-400">Contact:</span> <span className="font-mono">{appointmentToDelete.phone}</span> · {appointmentToDelete.email}
              </div>
            </div>

            <p className="text-xs text-red-600 leading-relaxed font-medium">
              Are you sure? This action will permanently delete this patient record from MongoDB Atlas.
            </p>

            <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingAppointment}
                onClick={handleConfirmDeleteAppointment}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeletingAppointment ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PRINT OPD SLIP */}
      {/* ========================================================= */}
      {selectedAppointmentForPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Printable OPD Slip Layout */}
            <div id="printable-opd-slip" className="border-2 border-stone-800 p-6 rounded-xl space-y-4 text-slate-900">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-tight text-[#2D543E]">
                    Medilife General Hospital
                  </h2>
                  <p className="text-[10px] text-stone-500">
                    Springfield Healthcare District · 24/7 Helpline: 1800-419-8800
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 border border-stone-300 rounded">
                    OPD Consultation Slip
                  </span>
                  <div className="font-mono text-xs font-bold mt-1 text-[#2D543E]">
                    {selectedAppointmentForPrint.confirmationCode}
                  </div>
                </div>
              </div>

              {/* Patient Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Patient Name</span>
                  <span className="font-bold">{selectedAppointmentForPrint.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Age / Gender</span>
                  <span>{selectedAppointmentForPrint.age} yrs / {selectedAppointmentForPrint.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Phone</span>
                  <span className="font-mono">{selectedAppointmentForPrint.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Date & Slot</span>
                  <span className="font-semibold">{selectedAppointmentForPrint.date} ({selectedAppointmentForPrint.timeSlot})</span>
                </div>
              </div>

              {/* Assigned Doctor & Room */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 text-xs">
                <div>
                  <span className="text-[10px] text-emerald-800 block uppercase font-semibold">Consulting Specialist</span>
                  <span className="font-bold text-slate-900">{selectedAppointmentForPrint.doctorName}</span>
                  <span className="block text-[11px] text-emerald-700">{selectedAppointmentForPrint.departmentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 block uppercase font-semibold">Consultation Suite</span>
                  <span className="font-mono font-bold text-slate-900">{selectedAppointmentForPrint.roomNumber}</span>
                  <span className="block text-[11px] text-stone-500">Status: {selectedAppointmentForPrint.status}</span>
                </div>
              </div>

              {/* Chief Reason for Visit */}
              <div className="text-xs">
                <span className="text-[10px] text-stone-400 block uppercase font-semibold">Reason for Consultation:</span>
                <p className="italic text-slate-700">{selectedAppointmentForPrint.visitReason}</p>
                {selectedAppointmentForPrint.symptoms && (
                  <p className="text-[11px] text-stone-500 mt-0.5">Symptoms: {selectedAppointmentForPrint.symptoms}</p>
                )}
              </div>

              {/* Blank Rx / Clinical Vitals slot */}
              <div className="border border-dashed border-stone-300 p-4 rounded-lg min-h-[100px] text-xs text-stone-400">
                <div className="text-[10px] uppercase font-bold text-stone-400 mb-2">Doctor Clinical Notes / Rx:</div>
                <div className="h-16 border-b border-stone-200"></div>
              </div>

              {/* Signature Line */}
              <div className="flex items-center justify-between pt-4 text-xs text-stone-500">
                <span>Printed on: {new Date().toLocaleDateString()}</span>
                <div className="text-center">
                  <div className="w-32 border-b border-stone-400 mb-1"></div>
                  <span className="text-[10px]">Doctor / OPD In-charge Sign</span>
                </div>
              </div>
            </div>

            {/* Print Modal Footer */}
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => setSelectedAppointmentForPrint(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 bg-stone-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#2D543E] hover:bg-[#234331] rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  languages: string[];
  consultationFee: string;
  availableDays: string[];
  availableSlots: string[];
  roomNumber: string;
  rating: number;
  reviewCount: number;
  bio: string;
  avatarUrl?: string;
  imageFallbackGradient: string;
  education: string[];
  memberships: string[];
  status?: 'available' | 'on_leave' | 'emergency_only';
  dutyNote?: string;
  phone?: string;
  email?: string;
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  headDoctorId: string;
  bedCount: number;
  isEmergency24x7: boolean;
  floorLocation: string;
  keyServices: string[];
  diagnosticTech: string[];
  imagePath?: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  createdAt: string;
  role?: 'patient' | 'admin' | 'staff';
}

export interface Appointment {
  id: string;
  userId?: string;
  patientName: string;
  email: string;
  phone: string;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  age: number;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  timeSlot: string;
  visitReason: string;
  symptoms?: string;
  roomNumber: string;
  status: 'Confirmed' | 'Rescheduled' | 'Cancelled' | 'In-Consultation' | 'Completed';
  createdAt: string;
  confirmationCode: string;
  adminNotes?: string;
  tokenNumber?: number;
}

export interface Testimonial {
  id: string;
  patientName: string;
  age: number;
  condition: string;
  departmentName: string;
  doctorName: string;
  quote: string;
  outcome: string;
  date: string;
}

export type PageView = 'home' | 'about' | 'departments' | 'doctors' | 'admin';


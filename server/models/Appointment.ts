export interface IAppointment {
  id: string;
  confirmationCode?: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  patientAge?: string | number;
  phone?: string;
  email?: string;
  age?: number | string;
  gender: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  date: string;
  timeSlot: string;
  visitReason?: string;
  symptoms?: string;
  roomNumber?: string;
  adminNotes?: string;
  consultationType?: 'in-person' | 'video';
  status: 'Confirmed' | 'In-Consultation' | 'Completed' | 'Cancelled' | 'Rescheduled';
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

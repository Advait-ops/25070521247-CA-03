export interface IAppointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: string;
  gender: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  consultationType: 'in-person' | 'video';
  status: 'Confirmed' | 'In-Consultation' | 'Completed' | 'Cancelled';
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

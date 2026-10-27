export interface IDoctor {
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
  imageFallbackGradient?: string;
  education?: string[];
  memberships?: string[];
  status?: 'available' | 'on_duty' | 'in_consultation' | 'on_leave';
  dutyNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

import { Doctor } from '../types';
import { DOCTORS } from '../data/hospitalData';

export async function fetchDoctorsList(): Promise<Doctor[]> {
  try {
    const res = await fetch('/api/doctors');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return DOCTORS;
  } catch (err) {
    console.warn('Could not fetch doctors from API, using default list:', err);
    return DOCTORS;
  }
}

export async function createDoctor(doctorData: Partial<Doctor>): Promise<Doctor | null> {
  try {
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    return result.doctor;
  } catch (err) {
    console.error('Error creating doctor:', err);
    return null;
  }
}

export async function updateDoctor(id: string, updates: Partial<Doctor>): Promise<boolean> {
  try {
    const res = await fetch(`/api/doctors/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error('Error updating doctor:', err);
    return false;
  }
}

export async function deleteDoctor(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/doctors/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error('Error deleting doctor:', err);
    return false;
  }
}

export async function fetchAdminOverview(): Promise<any> {
  try {
    const res = await fetch('/api/admin/overview');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    return null;
  }
}

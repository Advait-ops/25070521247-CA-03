import { Appointment } from '../types';

export interface MongoStatus {
  status: string;
  database: 'mongodb' | 'memory_fallback';
  connectedToMongo: boolean;
  hasMongoUri: boolean;
}

export async function checkMongoStatus(): Promise<MongoStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status API error');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      database: 'memory_fallback',
      connectedToMongo: false,
      hasMongoUri: false,
    };
  }
}

export async function fetchMongoAppointments(userId?: string): Promise<Appointment[]> {
  try {
    const url = userId ? `/api/appointments?userId=${encodeURIComponent(userId)}` : '/api/appointments';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Could not fetch appointments from MongoDB API, using local fallback:', err);
    return [];
  }
}

export async function saveMongoAppointment(appointment: Appointment): Promise<boolean> {
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return true;
  } catch (err) {
    console.warn('Could not save appointment to MongoDB backend:', err);
    return false;
  }
}

export async function updateMongoAppointmentStatus(
  id: string, 
  status: 'Confirmed' | 'Rescheduled' | 'Cancelled'
): Promise<boolean> {
  try {
    const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return true;
  } catch (err) {
    console.warn('Could not update appointment status in MongoDB backend:', err);
    return false;
  }
}

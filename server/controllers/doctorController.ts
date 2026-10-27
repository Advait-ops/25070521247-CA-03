import { Request, Response } from 'express';
import { getDb, inMemoryDoctors } from '../config/db.ts';
import { IDoctor } from '../models/Doctor.ts';

export async function getDoctors(req: Request, res: Response) {
  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('doctors');
      const docs = await collection.find({}).toArray();
      if (docs.length > 0) {
        return res.json(docs);
      }
      return res.json(inMemoryDoctors);
    }
    return res.json(inMemoryDoctors);
  } catch (err: any) {
    console.error('Error fetching doctors from MongoDB:', err);
    res.json(inMemoryDoctors);
  }
}

export async function createDoctor(req: Request, res: Response) {
  const doctorData = req.body;
  if (!doctorData || !doctorData.name || !doctorData.departmentId) {
    return res.status(400).json({ error: 'Name and Department are required' });
  }

  const newDoctor: IDoctor = {
    id: doctorData.id || `doc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: doctorData.name,
    title: doctorData.title || 'Consultant Specialist',
    departmentId: doctorData.departmentId,
    departmentName: doctorData.departmentName || 'General Medicine',
    specialty: doctorData.specialty || 'General Practice',
    qualifications: doctorData.qualifications || 'MBBS, MD',
    experienceYears: Number(doctorData.experienceYears) || 5,
    languages: Array.isArray(doctorData.languages) ? doctorData.languages : ['English', 'Hindi'],
    consultationFee: doctorData.consultationFee || '₹1,000',
    availableDays: Array.isArray(doctorData.availableDays) && doctorData.availableDays.length > 0 
      ? doctorData.availableDays 
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: Array.isArray(doctorData.availableSlots) && doctorData.availableSlots.length > 0
      ? doctorData.availableSlots
      : ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    roomNumber: doctorData.roomNumber || 'OPD Room 101',
    rating: Number(doctorData.rating) || 4.9,
    reviewCount: Number(doctorData.reviewCount) || 10,
    bio: doctorData.bio || 'Experienced specialist committed to excellence in patient-first care.',
    avatarUrl: doctorData.avatarUrl || '',
    imageFallbackGradient: doctorData.imageFallbackGradient || 'from-emerald-700 to-teal-900',
    education: Array.isArray(doctorData.education) ? doctorData.education : ['Government Medical College (MBBS)'],
    memberships: Array.isArray(doctorData.memberships) ? doctorData.memberships : ['Medical Council of India'],
    status: doctorData.status || 'available',
    dutyNote: doctorData.dutyNote || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('doctors');
      await collection.updateOne(
        { id: newDoctor.id },
        { $set: newDoctor },
        { upsert: true }
      );
    }
    const idx = inMemoryDoctors.findIndex((d) => d.id === newDoctor.id);
    if (idx >= 0) inMemoryDoctors[idx] = newDoctor;
    else inMemoryDoctors.push(newDoctor);

    return res.status(201).json({ success: true, doctor: newDoctor });
  } catch (err: any) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ error: 'Failed to add doctor', details: err.message });
  }
}

export async function updateDoctor(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('doctors');
      await collection.updateOne(
        { id },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
    }
    const idx = inMemoryDoctors.findIndex((d) => d.id === id);
    if (idx >= 0) {
      inMemoryDoctors[idx] = { ...inMemoryDoctors[idx], ...updates, updatedAt: new Date().toISOString() };
    }
    return res.json({ success: true, id, updates });
  } catch (err: any) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ error: 'Failed to update doctor', details: err.message });
  }
}

export async function deleteDoctor(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('doctors');
      await collection.deleteOne({ id });
    }
    const idx = inMemoryDoctors.findIndex((d) => d.id === id);
    if (idx >= 0) inMemoryDoctors.splice(idx, 1);
    return res.json({ success: true, message: `Doctor ${id} removed` });
  } catch (err: any) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ error: 'Failed to delete doctor', details: err.message });
  }
}

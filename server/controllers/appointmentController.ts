import type { Request, Response } from 'express';
import { getDb, inMemoryAppointments } from '../config/db.ts';
import type { IAppointment } from '../models/Appointment.ts';

export async function getAppointments(req: Request, res: Response) {
  const { userId, all } = req.query;

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('appointments');
      const query = (all === 'true' || !userId) ? {} : { userId: String(userId) };
      const appointments = await collection.find(query).sort({ createdAt: -1 }).toArray();
      return res.json(appointments);
    } else {
      let filtered = inMemoryAppointments;
      if (userId && all !== 'true') {
        filtered = inMemoryAppointments.filter((a) => a.userId === userId);
      }
      return res.json(filtered);
    }
  } catch (err: any) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to retrieve appointments from MongoDB', details: err.message });
  }
}

export async function createAppointment(req: Request, res: Response) {
  const appointment = req.body;

  if (!appointment || !appointment.id || !appointment.patientName) {
    return res.status(400).json({ error: 'Invalid appointment data' });
  }

  const enrichedAppointment: IAppointment = {
    ...appointment,
    status: appointment.status || 'Confirmed',
    createdAt: appointment.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('appointments');
      await collection.updateOne(
        { id: enrichedAppointment.id },
        { $set: enrichedAppointment },
        { upsert: true }
      );
      return res.status(201).json({
        success: true,
        source: 'mongodb',
        appointment: enrichedAppointment,
      });
    } else {
      const existingIdx = inMemoryAppointments.findIndex((a) => a.id === enrichedAppointment.id);
      if (existingIdx >= 0) {
        inMemoryAppointments[existingIdx] = enrichedAppointment;
      } else {
        inMemoryAppointments.unshift(enrichedAppointment);
      }
      return res.status(201).json({
        success: true,
        source: 'memory_fallback',
        appointment: enrichedAppointment,
      });
    }
  } catch (err: any) {
    console.error('Error inserting appointment into MongoDB:', err);
    res.status(500).json({ error: 'Failed to store appointment', details: err.message });
  }
}

export async function updateAppointment(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('appointments');
      const result = await collection.updateOne(
        { $or: [{ id }, { confirmationCode: id }] },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      console.log(`[Update Appointment] Updated in MongoDB: ${id}, modified: ${result.modifiedCount}`);
      return res.json({ success: true, source: 'mongodb', modifiedCount: result.modifiedCount });
    } else {
      const apt = inMemoryAppointments.find((a) => a.id === id || a.confirmationCode === id);
      if (apt) {
        Object.assign(apt, updates, { updatedAt: new Date().toISOString() });
      }
      return res.json({ success: true, source: 'memory_fallback' });
    }
  } catch (err: any) {
    console.error('Error updating appointment in MongoDB:', err);
    res.status(500).json({ error: 'Failed to update appointment', details: err.message });
  }
}

export async function deleteAppointment(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('appointments');
      const result = await collection.deleteOne({
        $or: [{ id }, { confirmationCode: id }]
      });
      console.log(`[Delete Appointment] Deleted from MongoDB: ${id}, count: ${result.deletedCount}`);
      return res.json({ success: true, source: 'mongodb', deletedCount: result.deletedCount });
    } else {
      const idx = inMemoryAppointments.findIndex((a) => a.id === id || a.confirmationCode === id);
      if (idx >= 0) inMemoryAppointments.splice(idx, 1);
      return res.json({ success: true, source: 'memory_fallback' });
    }
  } catch (err: any) {
    console.error('Error deleting appointment in MongoDB:', err);
    res.status(500).json({ error: 'Failed to delete appointment', details: err.message });
  }
}

import type { Request, Response } from 'express';
import { getDb, inMemoryAppointments, inMemoryDoctors } from '../config/db.ts';

export async function getStatus(req: Request, res: Response) {
  const activeDb = await getDb();
  let appointmentCount = inMemoryAppointments.length;
  let doctorCount = inMemoryDoctors.length;

  if (activeDb) {
    try {
      appointmentCount = await activeDb.collection('appointments').countDocuments();
      doctorCount = await activeDb.collection('doctors').countDocuments();
    } catch (e) {
      // ignore
    }
  }

  res.json({
    status: 'online',
    database: activeDb ? 'mongodb' : 'memory_fallback',
    connectedToMongo: !!activeDb,
    hasMongoUri: !!process.env.MONGODB_URI,
    stats: {
      appointments: appointmentCount,
      doctors: doctorCount,
    },
  });
}

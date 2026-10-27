import type { Request, Response } from 'express';
import { getDb, inMemoryAppointments, inMemoryDoctors } from '../config/db.ts';

export async function getAdminOverview(req: Request, res: Response) {
  try {
    const activeDb = await getDb();
    let appointments: any[] = [];
    let doctors: any[] = [];

    if (activeDb) {
      appointments = await activeDb.collection('appointments').find({}).toArray();
      doctors = await activeDb.collection('doctors').find({}).toArray();
    } else {
      appointments = inMemoryAppointments;
      doctors = inMemoryDoctors;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(
      (a) => a.date === todayStr || (a.createdAt && a.createdAt.startsWith(todayStr))
    );

    const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
    const inConsultationCount = appointments.filter((a) => a.status === 'In-Consultation').length;
    const completedCount = appointments.filter((a) => a.status === 'Completed').length;
    const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

    // Calculate approximate OPD revenue from consultation fees
    let totalRevenue = 0;
    appointments.forEach((apt) => {
      if (apt.status !== 'Cancelled') {
        const doc = doctors.find((d) => d.id === apt.doctorId);
        if (doc && doc.consultationFee) {
          const num = parseInt(doc.consultationFee.replace(/[^\d]/g, ''), 10);
          if (!isNaN(num)) totalRevenue += num;
        } else {
          totalRevenue += 1000;
        }
      }
    });

    res.json({
      totalAppointments: appointments.length,
      todayAppointmentsCount: todayAppointments.length,
      confirmedCount,
      inConsultationCount,
      completedCount,
      cancelledCount,
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter((d) => d.status !== 'on_leave').length,
      totalRevenue,
      database: activeDb ? 'mongodb' : 'memory_fallback',
    });
  } catch (err: any) {
    console.error('Error in admin overview:', err);
    res.status(500).json({ error: 'Failed to fetch admin overview', details: err.message });
  }
}

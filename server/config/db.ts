import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { INITIAL_SEED_DOCTORS } from '../data/seedDoctors.ts';
import type { IDoctor } from '../models/Doctor.ts';
import type { IAppointment } from '../models/Appointment.ts';

// Force load .env with override so live credentials take precedence
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

export let inMemoryAppointments: IAppointment[] = [];
export let inMemoryDoctors: IDoctor[] = [...INITIAL_SEED_DOCTORS];

let mongoClient: MongoClient | null = null;
let dbInstance: any = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    return null;
  }

  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      await mongoClient.connect();
    }
    dbInstance = mongoClient.db(process.env.MONGODB_DB_NAME || 'medilife_hospital');
    console.log('Connected to MongoDB database: medilife_hospital');

    // Auto-seed doctors collection if empty
    try {
      const doctorsCol = dbInstance.collection('doctors');
      const count = await doctorsCol.countDocuments();
      if (count === 0 && INITIAL_SEED_DOCTORS.length > 0) {
        console.log(`Seeding ${INITIAL_SEED_DOCTORS.length} initial doctors to MongoDB collection 'doctors'...`);
        await doctorsCol.insertMany(
          INITIAL_SEED_DOCTORS.map((d) => ({
            ...d,
            status: d.status || 'available',
            createdAt: new Date().toISOString(),
          }))
        );
        console.log('Doctors collection seeded successfully.');
      }
    } catch (seedErr) {
      console.warn('Doctor auto-seeding note:', seedErr);
    }

    return dbInstance;
  } catch (err) {
    mongoClient = null;
    dbInstance = null;
    console.error('MongoDB connection error:', err);
    return null;
  }
}

export function getMongoClient(): MongoClient | null {
  return mongoClient;
}

// Immediate eager connection attempt
getDb();

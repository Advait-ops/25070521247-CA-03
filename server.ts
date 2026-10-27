import express from 'express';
import { createServer as createViteServer } from 'vite';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Force load .env with override so live credentials take precedence over any default placeholder
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Dynamic MongoDB connection with in-memory fallback
let inMemoryAppointments: any[] = [];
let mongoClient: MongoClient | null = null;
let db: any = null;

async function getDb() {
  if (db) return db;
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
    db = mongoClient.db(process.env.MONGODB_DB_NAME || 'medilife_hospital');
    console.log('Connected to MongoDB database: medilife_hospital');
    return db;
  } catch (err) {
    mongoClient = null;
    db = null;
    console.error('MongoDB connection error:', err);
    return null;
  }
}

getDb();

// API ROUTES
app.get('/api/status', async (req, res) => {
  const activeDb = await getDb();
  res.json({
    status: 'online',
    database: activeDb ? 'mongodb' : 'memory_fallback',
    connectedToMongo: !!activeDb,
    hasMongoUri: !!process.env.MONGODB_URI,
  });
});

// GET /api/appointments?userId=...
app.get('/api/appointments', async (req, res) => {
  const { userId } = req.query;

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('appointments');
      const query = userId ? { userId: String(userId) } : {};
      const appointments = await collection.find(query).sort({ createdAt: -1 }).toArray();
      return res.json(appointments);
    } else {
      let filtered = inMemoryAppointments;
      if (userId) {
        filtered = inMemoryAppointments.filter((a) => a.userId === userId);
      }
      return res.json(filtered);
    }
  } catch (err: any) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to retrieve appointments from MongoDB', details: err.message });
  }
});

// POST /api/appointments
app.post('/api/appointments', async (req, res) => {
  const appointment = req.body;

  if (!appointment || !appointment.id || !appointment.patientName) {
    return res.status(400).json({ error: 'Invalid appointment data' });
  }

  const enrichedAppointment = {
    ...appointment,
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
});

// PATCH /api/appointments/:id
app.patch('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const activeDb = await getDb();
    if (activeDb) {
      const collection = activeDb.collection('appointments');
      await collection.updateOne(
        { id },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );
      return res.json({ success: true, source: 'mongodb' });
    } else {
      const apt = inMemoryAppointments.find((a) => a.id === id);
      if (apt) {
        Object.assign(apt, updates, { updatedAt: new Date().toISOString() });
      }
      return res.json({ success: true, source: 'memory_fallback' });
    }
  } catch (err: any) {
    console.error('Error updating appointment in MongoDB:', err);
    res.status(500).json({ error: 'Failed to update appointment', details: err.message });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Medilife General Hospital full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

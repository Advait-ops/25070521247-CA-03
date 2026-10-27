import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

// Routes
import doctorRoutes from './routes/doctorRoutes.ts';
import appointmentRoutes from './routes/appointmentRoutes.ts';
import adminRoutes from './routes/adminRoutes.ts';
import statusRoutes from './routes/statusRoutes.ts';

// Config
import './config/db.ts';

// Ensure .env is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

export const app = express();
const PORT = process.env.NODE_ENV === 'production'
  ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000)
  : 3000;

app.use(express.json());

// API Routes
app.use('/api/status', statusRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

// Server startup function
export async function startServer() {
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
    console.log(`[Medilife Server] Backend & Vite running on http://0.0.0.0:${PORT}`);
  });
}

// Auto start if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

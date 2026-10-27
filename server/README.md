# Medilife Hospital - Backend Server

This directory contains the Express and MongoDB Atlas backend API server.

## Architecture
- `config/`
  - `db.ts`: MongoDB Atlas connection pool, auto-reconnect, and seeding logic
- `models/`
  - `Doctor.ts`: Doctor data model schema and interfaces
  - `Appointment.ts`: Appointment data model schema and interfaces
- `controllers/`
  - `doctorController.ts`: Handles CRUD operations for doctors roster
  - `appointmentController.ts`: Handles CRUD operations for appointment bookings
  - `adminController.ts`: Computes hospital metrics, revenue analytics, and daily roster overview
  - `statusController.ts`: MongoDB connectivity and server health verification
- `routes/`
  - `doctorRoutes.ts`: `/api/doctors`
  - `appointmentRoutes.ts`: `/api/appointments`
  - `adminRoutes.ts`: `/api/admin`
  - `statusRoutes.ts`: `/api/status`
- `server.ts`: Express application setup and routing
- `package.json`: Backend dependencies specification

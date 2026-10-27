# Medilife Hospital - Frontend Client

This directory contains the entire frontend React application built with TypeScript, Vite, Tailwind CSS, and Lucide icons.

## Directory Structure
- `src/`
  - `components/`: UI components (Navbar, Footer, Hero, AdminPortal, AppointmentModal, DoctorCard, DoctorProfileModal, AuthModal, MyAppointmentsDrawer, etc.)
  - `components/pages/`: Page views (`HomePage.tsx`, `DepartmentsPage.tsx`, `DoctorsPage.tsx`, `AboutPage.tsx`)
  - `context/`: Application state management (`AuthContext.tsx`, `DoctorContext.tsx`)
  - `data/`: Department information and initial hospital data (`hospitalData.ts`)
  - `services/`: Client-side API and database sync services (`mongoAppointmentService.ts`, `doctorService.ts`)
  - `assets/`: Hospital facility and department photography
  - `App.tsx`: Main application coordinator
  - `main.tsx`: React 19 root bootstrap
  - `types.ts`: Shared TypeScript types and interfaces
- `index.html`: Client HTML template
- `package.json`: Client dependencies specification

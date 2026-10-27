# Medilife General Hospital Web Application

A full-stack healthcare web application organized cleanly into dedicated **frontend (`client/`)** and **backend (`server/`)** environments.

## Project Structure

```
25070521247-CA-03/
├── client/                  # Frontend Application
│   ├── index.html           # Client entry HTML
│   ├── package.json         # Frontend dependencies (React 19, Tailwind, Lucide)
│   ├── README.md            # Frontend documentation
│   └── src/
│       ├── assets/          # Photography & icons
│       ├── components/      # UI components (AdminPortal, BookingModal, Navbar, etc.)
│       ├── context/         # Auth & Doctor state contexts
│       ├── data/            # Hospital data & departments
│       ├── services/        # Client API services (MongoDB & Firebase)
│       ├── App.tsx          # Main React App component
│       ├── main.tsx         # React bootstrap
│       └── types.ts         # TypeScript definitions
│
├── server/                  # Backend Application
│   ├── config/              # MongoDB connection pool (db.ts)
│   ├── controllers/         # API controllers (Doctor, Appointment, Admin, Status)
│   ├── data/                # Initial seed data for MongoDB
│   ├── models/              # Schema interfaces (Doctor, Appointment)
│   ├── routes/              # Express API route endpoints (/api/*)
│   ├── package.json         # Backend dependencies (Express, MongoDB)
│   ├── README.md            # Backend architecture documentation
│   └── server.ts            # Express server configuration
│
├── server.ts                # Root coordinator (starts Express & Vite SPA)
├── start.bat                # 1-Click launcher for Windows
├── vite.config.ts           # Vite bundler & path aliases
├── tsconfig.json            # TypeScript configuration
└── package.json             # Root workspace runner scripts
```

## How to Run Locally

### Option 1: Quick Start (Windows)
Double-click **`start.bat`** in the project folder. It will install packages and automatically open `http://localhost:3000` in your browser.

### Option 2: Command Line (PowerShell / Command Prompt / Terminal)
1. Open PowerShell or Command Prompt in this folder.
2. Install dependencies:
   ```bash
   npm.cmd install
   ```
   *(Or `npm install` if using standard Command Prompt or bash)*
3. Run the development server:
   ```bash
   npm.cmd run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

> **Why opening `index.html` directly didn't work:**
> Modern React & TypeScript web applications cannot be opened directly from the filesystem (`file:///.../index.html`) by double-clicking the HTML file because browsers block module imports over `file://` and cannot compile `.tsx` files without a dev server. Running `npm run dev` or `start.bat` provides the Vite compilation server and Express backend API.


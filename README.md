

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


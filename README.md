<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/31700315-a04d-44b8-978a-fa5d8af97192

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


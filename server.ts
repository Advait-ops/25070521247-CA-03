/**
 * Full-Stack Root Entry Point
 * Coordinates the backend Express API (./server/) and frontend client (./client/)
 */
import { startServer, app } from './server/server.ts';

startServer();

export { app };

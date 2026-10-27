import { Router } from 'express';
import { getAdminOverview } from '../controllers/adminController.ts';

const router = Router();

router.get('/overview', getAdminOverview);

export default router;

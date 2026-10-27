import { Router } from 'express';
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController.ts';

const router = Router();

router.get('/', getDoctors);
router.post('/', createDoctor);
router.patch('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;

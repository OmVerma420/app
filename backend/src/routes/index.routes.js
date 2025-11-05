// In routes/index.routes.js
import { Router } from 'express';
import studentRoutes from './student.routes.js';
import applicationRoutes from './application.routes.js'; 

const router = Router();

router.use('/students', studentRoutes);

router.use('/applications', applicationRoutes);

export default router;
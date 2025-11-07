import { Router } from 'express';
import studentRoutes from './student.routes.js';
import applicationRoutes from './application.routes.js';
import adminRoutes from './admin.routes.js'; // ✅ NEW

const router = Router();

router.use('/students', studentRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes); // ✅ NEW

export default router;

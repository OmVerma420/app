import { Router } from 'express';
import { 
  loginStudent,
  logoutStudent,
  getStudentProfile // <-- 1. Import your new function
} from '../controllers/student.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js'; // Make sure this path is correct

const router = Router();

// --- Public Route ---
router.route('/login').post(loginStudent);

// --- Secured Routes ---
router.route('/logout').post(verifyJWT, logoutStudent);

// --- 2. ADD THIS ROUTE ---
// This route now exists and will fix your 404 error
router.route('/me').get(verifyJWT, getStudentProfile); 

export default router;


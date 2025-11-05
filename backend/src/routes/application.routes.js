import { Router } from 'express';
import { 
  submitApplication,
  confirmPayment, // <-- 1. Import new function
  getMyApplication
} from '../controllers/application.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

// All application routes are secured
router.use(verifyJWT);

// Page 3 Submit Button
router.route('/submit').post(
  upload.single('marksheet'), // <-- 2. Changed to .single() to match your controller
  submitApplication
);

// --- 3. ADD NEW ROUTE for Page 4 Pay Button ---
router.route('/confirm-payment').post(confirmPayment);
// --- END NEW ROUTE ---

// --- ADD UPDATE ROUTE ---
router.route('/update').put(
  upload.single('marksheet'),
  submitApplication // Reuse the same controller for update
);
// --- END UPDATE ROUTE ---

// Page 5 Load
router.route('/my-application').get(getMyApplication);

export default router;


import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  getCLCStats,
  listApplications,
  searchByReferenceId,
  getApplicationById,
  updateApplicationStatus,
} from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middleware/adminAuth.js";

const router = Router();

// Auth
router.post("/login", loginAdmin);
router.post("/logout", verifyAdminJWT, logoutAdmin);
router.get("/me", verifyAdminJWT, getAdminProfile);

// Dashboard
router.get("/clc/stats", verifyAdminJWT, getCLCStats);

// Applications
router.get("/applications", verifyAdminJWT, listApplications);
router.get("/applications/search", verifyAdminJWT, searchByReferenceId);
router.get("/applications/:id", verifyAdminJWT, getApplicationById);
router.put("/applications/:id/status", verifyAdminJWT, updateApplicationStatus);

export default router;

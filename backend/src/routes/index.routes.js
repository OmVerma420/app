import { Router } from "express";

import studentRoutes from "./student.routes.js";
import applicationRoutes from "./application.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/admin", adminRoutes);   // ✅ FIRST
router.use("/students", studentRoutes);
router.use("/applications", applicationRoutes);


export default router;

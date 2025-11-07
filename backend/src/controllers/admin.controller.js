import { Admin } from "../models/admin.model.js";
import { Application } from "../models/application.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// --- Auth ---
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("📌 LOGIN REQUEST:", email, password);

  const admin = await Admin.findOne({ email });

  console.log("📌 FOUND ADMIN:", admin);

  if (!admin) throw new ApiError(401, "Invalid credentials");


  const ok = await admin.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = admin.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
  };

  return res
    .status(200)
    .cookie("adminToken", token, options)
    .json(new ApiResponse(200, { admin, token }, "Admin logged in"));
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
  };
  return res
    .status(200)
    .clearCookie("adminToken", options)
    .json(new ApiResponse(200, {}, "Admin logged out"));
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.admin, "OK"));
});

// --- Dashboard: counts (applied vs approved) ---
export const getCLCStats = asyncHandler(async (req, res) => {
  const [applied, approved, printed] = await Promise.all([
    Application.countDocuments({ status: "applied" }),
    Application.countDocuments({ status: "approved" }),
    Application.countDocuments({ status: "printed" }),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { applied, approved, printed }, "Stats"));
});

// --- List applications with filters ---
export const listApplications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    status,       // optional: applied/approved/printed
    q,            // optional keyword (studentName, registrationNo, referenceId)
  } = req.query;

  const where = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.$gte = new Date(startDate);
    if (endDate) where.createdAt.$lte = new Date(endDate);
  }

  if (status) where.status = status;

  // keyword search across joined student fields and app fields
  const or = [];
  if (q) {
    or.push(
      { registrationNo: new RegExp(q, "i") },
      { examRollNo: new RegExp(q, "i") }
    );
  }

  const query = or.length ? { $and: [where, { $or: or }] } : where;

  const docs = await Application.find(query)
    .populate("student", "referenceId studentName")
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Application.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, { docs, total, page: Number(page), limit: Number(limit) }, "OK"));
});

// --- Search by student referenceId ---
export const searchByReferenceId = asyncHandler(async (req, res) => {
  const { referenceId } = req.query;
  if (!referenceId) throw new ApiError(400, "referenceId is required");

  const docs = await Application.find()
    .populate({
      path: "student",
      match: { referenceId },
      select: "referenceId studentName",
    })
    .sort({ createdAt: -1 });

  // Filter apps with matched student (since match happens inside populate)
  const filtered = docs.filter(d => d.student !== null);

  return res.status(200).json(new ApiResponse(200, filtered, "OK"));
});

// --- Get single application with full details ---
export const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await Application.findById(id).populate("student", "referenceId studentName");
  if (!doc) throw new ApiError(404, "Application not found");
  return res.status(200).json(new ApiResponse(200, doc, "OK"));
});

// --- Update status (approve/printed) + notes ---
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body; // status: applied|approved|printed

  const doc = await Application.findById(id);
  if (!doc) throw new ApiError(404, "Application not found");

  if (status) {
    doc.status = status;
    if (status === "approved") {
      doc.approvedAt = new Date();
      doc.approvedBy = req.admin._id;
    }
    if (status === "printed") {
      doc.printedAt = new Date();
    }
  }

  if (typeof notes === "string") {
    doc.notes = notes;
  }

  await doc.save();
  return res.status(200).json(new ApiResponse(200, doc, "Updated"));
});

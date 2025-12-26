import { Admin } from "../models/admin.model.js";
import { Application } from "../models/application.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

/* ======================================================
 ✅ ADMIN LOGIN
====================================================== */
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("📌 LOGIN REQUEST:", email);

  const admin = await Admin.findOne({ email });

  if (!admin) throw new ApiError(401, "Invalid credentials");

  const ok = await admin.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  // ✅ Create token
  const token = admin.generateAccessToken();

  // ✅ Cookie config
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("adminToken", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          admin: {
            _id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
        "Admin logged in"
      )
    );
});

/* ======================================================
 ✅ ADMIN LOGOUT
====================================================== */
export const logoutAdmin = asyncHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("adminToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Admin logged out"));
});

/* ======================================================
 ✅ GET ADMIN PROFILE (ME)
====================================================== */
export const getAdminProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.admin, "Admin profile"));
});

/* ======================================================
 ✅ DASHBOARD STATS
====================================================== */
export const getCLCStats = asyncHandler(async (req, res) => {
  const apps = await Application.find();

  const stats = {
    baApply: 0,
    bscApply: 0,
    iscApply: 0,

    baApprove: 0,
    bscApprove: 0,
    iscApprove: 0,

    applied: 0,
    approved: 0,
  };

  apps.forEach((app) => {
    const course = app.course?.trim();
    const status = app.status;

    // ✅ Applied Count
    if (status === "applied") {
      stats.applied++;

      if (course === "B.A.") stats.baApply++;
      if (course === "B.Sc.") stats.bscApply++;
      if (course === "I.Sc.") stats.iscApply++;
    }

    // ✅ Approved Count
    if (status === "approved") {
      stats.approved++;

      if (course === "B.A.") stats.baApprove++;
      if (course === "B.Sc.") stats.bscApprove++;
      if (course === "I.Sc.") stats.iscApprove++;
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Stats fetched"));
});



/* ======================================================
 ✅ LIST APPLICATIONS
====================================================== */
export const listApplications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    status,
    q,
  } = req.query;

  const where = {};

  // ✅ FIX DATE RANGE
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    where.createdAt = { $gte: start, $lte: end };
  }

  if (status) where.status = status;

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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        docs,
        total,
        page: Number(page),
        limit: Number(limit),
      },
      "OK"
    )
  );
});


/* ======================================================
 ✅ SEARCH APPLICATION BY REFERENCE ID
====================================================== */
export const searchByReferenceId = asyncHandler(async (req, res) => {
  const { referenceId } = req.query;
  if (!referenceId) throw new ApiError(400, "referenceId is required");

  const docs = await Application.find()
    .select("status fatherName course mobileNumber createdAt")
    .populate({
      path: "student",
      match: { referenceId },
      select: "referenceId studentName",
    })
    .sort({ createdAt: -1 });

  const filtered = docs.filter((d) => d.student !== null);

  return res
    .status(200)
    .json(new ApiResponse(200, filtered, "Search OK"));
});


/* ======================================================
 ✅ GET SINGLE APPLICATION
====================================================== */
export const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doc = await Application.findById(id).populate(
    "student",
    "referenceId studentName"
  );

  if (!doc) throw new ApiError(404, "Application not found");

  return res
    .status(200)
    .json(new ApiResponse(200, doc, "OK"));
});

/* ======================================================
 ✅ UPDATE STATUS + NOTES
====================================================== */
/* ======================================================
 ✅ UPDATE STATUS + NOTES
====================================================== */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const doc = await Application.findById(id).populate(
    "student",
    "referenceId studentName"
  );

  if (!doc) throw new ApiError(404, "Application not found");

  /* -------------------------------------------------------
    PRINT REQUEST — SHOULD NOT CHANGE STATUS
  -------------------------------------------------------- */
  if (status === "printed") {
    doc.printedAt = new Date();     // only timestamp
    await doc.save();

    return res.status(200).json(
      new ApiResponse(200, {
        status: doc.status,
        printedAt: doc.printedAt,
        approvedAt: doc.approvedAt,
        approvedBy: doc.approvedBy,
      }, "Printed timestamp updated")
    );
  }

  /* -------------------------------------------------------
    APPROVE REQUEST — COUNT ONLY FIRST TIME
  -------------------------------------------------------- */
  if (status === "approved") {
    if (doc.status !== "approved") {
      doc.status = "approved";
      doc.approvedAt = new Date();
      doc.approvedBy = req.admin._id;
    }
  }

  /* -------------------------------------------------------
    APPLIED REQUEST
  -------------------------------------------------------- */
  if (status === "applied") {
    doc.status = "applied";
  }

  /* -------------------------------------------------------
    NOTES UPDATE
  -------------------------------------------------------- */
  if (typeof notes === "string") {
    doc.notes = notes;
  }

  await doc.save();

  return res.status(200).json(
    new ApiResponse(200, {
      status: doc.status,
      printedAt: doc.printedAt,
      approvedAt: doc.approvedAt,
      approvedBy: doc.approvedBy,
    }, "Status updated")
  );
});


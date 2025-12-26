import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.adminToken;   // ✅ cookie only

  if (!token) throw new ApiError(401, "Unauthorized admin request");

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET);

    if (!decoded?._id) throw new ApiError(401, "Invalid token");

    const admin = await Admin.findById(decoded._id).select("-password -__v");

    if (!admin) throw new ApiError(401, "Admin not found");

    req.admin = admin;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid admin token");
  }
});

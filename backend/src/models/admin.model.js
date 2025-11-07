import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }, // future-proof for roles
    name: { type: String, default: "Administrator" },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.ADMIN_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ADMIN_TOKEN_EXPIRY || "1d" }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);

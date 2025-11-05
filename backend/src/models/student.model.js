import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

const studentSchema = new Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      index: true,
    },
    // ALL OTHER FIELDS (fatherName, class, etc.) ARE REMOVED
  },
  { timestamps: true }
);

// This method is still required for your login controller to work
studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      referenceId: this.referenceId,
      studentName: this.studentName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',
    }
  );
};

export const Student = mongoose.model('Student', studentSchema);

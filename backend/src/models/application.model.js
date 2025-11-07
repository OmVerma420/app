import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },

    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    course: { type: String, required: true },
    classRollNo: { type: String, required: true },
    session: { type: String, required: true },
    examRollNo: { type: String, required: true, unique: true },
    registrationNo: { type: String, required: true, unique: true },
    registrationYear: { type: String, required: true },
    examType: { type: String, required: true },
    resultStatus: { type: String, required: true },
    passingYear: { type: String, required: true },
    passingDivisionGrade: { type: String, required: true },
    boardUnivName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },

    address: {
      village: String,
      postOffice: String,
      policeStation: String,
      district: String,
      state: String,
      pinCode: String,
    },

    marksheetURL: { type: String, required: true },

    // Payment
    paymentId: { type: String, default: null },
    paymentAmount: { type: Number, default: null },
    paymentMode: { type: String, default: 'Online' },
    paymentDate: { type: Date, default: null },

    // ✅ Admin workflow fields
    status: {
      type: String,
      enum: ["applied", "approved", "printed"],
      default: "applied",
      index: true,
    },

    approvedAt: { type: Date, default: null },
    printedAt: { type: Date, default: null },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);

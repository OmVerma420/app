import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema(
  {
    // Link to the student who is applying
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    // --- NEW FIELDS TO BE FILLED BY STUDENT ---
    // (These were moved from the Student model)
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    course: { // Renamed from 'class' for clarity, but you can use 'class'
      type: String,
      required: true,
    },
    classRollNo: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    examRollNo: {
      type: String,
      required: true,
      unique: true,
    },
    registrationNo: {
      type: String,
      required: true,
      unique: true,
    },
    registrationYear: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
    },
    resultStatus: {
      type: String,
      required: true,
    },
    passingYear: {
      type: String,
      required: true,
    },
    passingDivisionGrade: {
      type: String,
      required: true,
    },
    boardUnivName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // --- END NEW FIELDS ---

    // Data from Page 3
    address: {
      village: String,
      postOffice: String,
      policeStation: String,
      district: String,
      state: String,
      pinCode: String,
    },
    marksheetURL: {
      type: String,
      required: true,
    },

    // Data from Page 4 (Payment)
    paymentId: {
      type: String,
      default: null,
    },
    paymentAmount: {
      type: Number,
      default: null,
    },
    paymentMode: {
      type: String,
      default: 'Online',
    },
    paymentDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
); // 'createdAt' will be our 'Apply Date'

export const Application = mongoose.model('Application', applicationSchema);

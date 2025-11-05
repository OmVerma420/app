import { Application } from '../models/application.model.js';
import { Student } from '../models/student.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// --- SUBMIT APPLICATION (PAGE 3) ---
const submitApplication = asyncHandler(async (req, res) => {
  const studentId = req.student?._id;
  const {
    fatherName,
    motherName,
    course,
    classRollNo,
    session,
    examRollNo,
    registrationNo,
    registrationYear,
    examType,
    resultStatus,
    passingYear,
    passingDivisionGrade,
    boardUnivName,
    mobileNumber,
    email,
    village,
    postOffice,
    policeStation,
    district,
    state,
    pinCode,
  } = req.body;

  const address = {
    village,
    postOffice,
    policeStation,
    district,
    state,
    pinCode,
  };

  if (!studentId) {
    throw new ApiError(400, "Student ID is missing. Please check the form.");
  }

  // Check if an application already exists for this student.
  // This allows the user to re-submit Page 3 if they go "Back"
  const existingApplication = await Application.findOne({ student: studentId });

  const isUpdate = !!existingApplication;

  if (!isUpdate && !req.file) {
    throw new ApiError(400, "Marksheet file is required. The file might have been rejected by the filter (must be .png, .jpg, .jpeg, or .webp).");
  }

  let marksheetBuffer;
  if (req.file) {
    marksheetBuffer = req.file.buffer;
  }

  // 5. Upload to Cloudinary only if file is provided
  let marksheetUploadResponse;
  if (marksheetBuffer) {
    try {
      marksheetUploadResponse = await uploadOnCloudinary(marksheetBuffer, "marksheet");
    } catch (error) {
       console.error("Cloudinary Upload Error:", error);
       throw new ApiError(500, "Failed to upload marksheet to Cloudinary.");
    }

    if (!marksheetUploadResponse || !marksheetUploadResponse.secure_url) {
       throw new ApiError(500, "Cloudinary upload failed, no URL returned.");
    }
  }

  if (existingApplication) {
    // If it exists, just update all fields
    existingApplication.fatherName = fatherName;
    existingApplication.motherName = motherName;
    existingApplication.course = course;
    existingApplication.classRollNo = classRollNo;
    existingApplication.session = session;
    existingApplication.examRollNo = examRollNo;
    existingApplication.registrationNo = registrationNo;
    existingApplication.registrationYear = registrationYear;
    existingApplication.examType = examType;
    existingApplication.resultStatus = resultStatus;
    existingApplication.passingYear = passingYear;
    existingApplication.passingDivisionGrade = passingDivisionGrade;
    existingApplication.boardUnivName = boardUnivName;
    existingApplication.mobileNumber = mobileNumber;
    existingApplication.email = email;
    existingApplication.address = address;
    if (marksheetUploadResponse && marksheetUploadResponse.secure_url) {
      existingApplication.marksheetURL = marksheetUploadResponse.secure_url;
    }
    // Keep existing payment info intact for updates

    await existingApplication.save();

    return res
      .status(200)
      .json(new ApiResponse(200, existingApplication, "Application updated successfully."));

  } else {
    // If it's a new application, create it
    const newApplication = await Application.create({
      student: studentId,
      fatherName,
      motherName,
      course,
      classRollNo,
      session,
      examRollNo,
      registrationNo,
      registrationYear,
      examType,
      resultStatus,
      passingYear,
      passingDivisionGrade,
      boardUnivName,
      mobileNumber,
      email,
      address: address,
      marksheetURL: marksheetUploadResponse.secure_url,
      // Payment fields will be null by default
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newApplication, "Application submitted successfully."));
  }
});


// --- NEW: CONFIRM PAYMENT (PAGE 4) ---
const confirmPayment = asyncHandler(async (req, res) => {
  const studentId = req.student?._id;
  
  // In a real app, you would verify this with a payment gateway (e.g., Stripe, Razorpay)
  // For this project, we'll just trust the data from the frontend.
  const { paymentId, paymentAmount } = req.body;

  if (!paymentId || !paymentAmount) {
    throw new ApiError(400, "Payment ID and Amount are required.");
  }

  // Find the application for this student
  const application = await Application.findOne({ student: studentId });

  if (!application) {
    throw new ApiError(404, "Application not found. Please complete the previous step.");
  }

  // Update the application with payment details from your model
  application.paymentId = paymentId;
  application.paymentAmount = paymentAmount;
  application.paymentMode = "Online"; // As per your PDF
  application.paymentDate = new Date();
  
  await application.save();

  return res
    .status(200)
    .json(new ApiResponse(200, application, "Payment confirmed successfully."));
});
// --- END NEW FUNCTION ---


// --- GET APPLICATION (PAGE 5) ---
const getMyApplication = asyncHandler(async (req, res) => {
    const studentId = req.student?._id;

    // We MUST populate 'student' to get all their info for the print page
    const application = await Application.findOne({ student: studentId })
                                         .populate('student');

    if (!application) {
        return res
            .status(404) // Send 404 so the frontend knows to show an error
            .json(new ApiResponse(404, null, "Application not found. Please apply first."));
    }
    
    // Also check if payment has been made
    if (!application.paymentId) {
       return res
            .status(402) // 402 Payment Required
            .json(new ApiResponse(402, null, "Payment not completed. Please complete the payment step."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, application, "Application fetched successfully."));
});

export { 
  submitApplication, 
  confirmPayment, // <-- Export the new function
  getMyApplication 
};


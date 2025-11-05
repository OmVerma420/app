import {Student} from '../models/student.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const loginStudent = asyncHandler(async(req, res) => {
    const { referenceId , studentName } = req.body;

    const student= await Student.findOne({referenceId, studentName})

    if(!student){
        throw new ApiError(401, "Wrong credentials")
    }
    const accessToken = await student.generateAccessToken(student._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: process.env.NODE_ENV === "production" ?'none':'strict',
        path: '/',
    }


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, {student,accessToken}, "Student logged in successfully"))
})

const logoutStudent = asyncHandler(async(req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ?'none':'strict',
        path: '/',
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "Student logged out successfully"))
})

const getStudentProfile = asyncHandler(async(req, res) => {
    const student = req.student;

    return res
    .status(200)
    .json(new ApiResponse(200, student, "Student profile retrieved successfully"))
})

export {
    loginStudent,
    logoutStudent,
    getStudentProfile
}

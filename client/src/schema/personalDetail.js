import { z } from "zod";

export const personalDetailSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  course: z.string().min(1, "Course is required"),
  classRollNo: z.string().min(1, "Class Roll No. is required"),
  session: z.string().min(1, "Session is required"),
  examRollNo: z.string().min(1, "Exam Roll No. is required"),
  registrationNo: z.string().min(1, "Registration No. is required"),
  registrationYear: z.string().min(1, "Registration Year is required"),
  examType: z.string().min(1, "Exam Type is required"),
  resultStatus: z.string().min(1, "Result Status is required"),
  passingYear: z.string().min(1, "Passing Year is required"),
  passingDivisionGrade: z.string().min(1, "Passing Division/Grade is required"),
  boardUnivName: z.string().min(1, "Board/University Name is required"),
  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address"),
});

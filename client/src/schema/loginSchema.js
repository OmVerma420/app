// src/schema/loginSchema.js
import { z } from "zod";

export const loginSchema = z.object({
  referenceId: z.string().min(3, "Reference ID must be at least 3 characters"),
  studentName: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
});

import { z } from "zod";

export const addressSchema = z.object({
  village: z.string().min(1, "Village/AT is required"),
  postOffice: z.string().min(1, "Post Office is required"),
  policeStation: z.string().min(1, "Police Station is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z
    .string()
    .regex(/^[0-9]{6}$/, "Pin Code must be 6 digits"),
});

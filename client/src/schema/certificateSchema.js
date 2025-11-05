import { z } from "zod";
import { personalDetailSchema } from "./personalDetail.js";
import { addressSchema } from "./addressSchema.js";

export const certificateFormSchema = z.object({
  personalDetail: personalDetailSchema,
  address: addressSchema,
  marksheet: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Final year marksheet is required")
    .refine(
      (files) => {
        const file = files[0];
        if (!file) return false;
        const allowed = ["image/jpeg", "image/png", "image/jpg"];
        return allowed.includes(file.type);
      },
      "Only JPG, JPEG, and PNG files are allowed"
    )
    .refine(
      (files) => {
        const file = files[0];
        if (!file) return false;
        return file.size >= 100 * 1024 && file.size <= 500 * 1024; // 100–500KB
      },
      "File size must be between 100KB and 500KB"
    ),
});

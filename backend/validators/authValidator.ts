import { z } from "zod";

// For requesting OTP (signup or login)
export const requestOtpSchema = z
  .object({
    mode: z.enum(["signup", "login"]),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    dob: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date of birth",
      })
      .optional(),
    email: z.string().email("Invalid email address"),
  })
  .refine(
    (data) => {
      if (data.mode === "signup") {
        return !!data.name && !!data.dob;
      }
      return true;
    },
    {
      message: "Name and DOB are required for signup",
      path: ["name"], // attach error message to "name" field
    }
  );

// For verifying OTP
export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

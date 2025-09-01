import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOTP, sendOTPEmail, setUserOTP } from "../utils/generateOtp.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 1. Request OTP
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { name, dob, email } = req.body;

    if (!name || !dob || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to DB (create user if not exists)
    await setUserOTP(email, otp);

    // Send OTP Email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2. Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after successful verification
    delete user.otp;
    delete user.otpExpiry;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        dob: user.dob,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

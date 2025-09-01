import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOTP, sendOTPEmail, setUserOTP } from "../utils/generateOtp.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//Request OTP
export const requestOTP = async (req: Request, res: Response) => {
    console.log("Requesting OTP...");
  try {
    const { name, dob, email, mode } = req.body;

    const user = await User.findOne({ email });
    const otp = generateOTP();

    if (mode === "signup") {
      // create new user with OTP
      await setUserOTP(email, otp, { name, dob });
    } else if (mode === "login") {
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found. Please sign up first" });
      }
      // set OTP for existing user
      await setUserOTP(email, otp);
    }

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

//Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after successful verification
    delete user.otp;
    delete user.otpExpiry;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

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

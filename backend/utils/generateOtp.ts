import sgMail from "@sendgrid/mail";
import User from "../models/User.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM || "no-reply@yourapp.com",
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in <b>5 minutes</b>.</p>`,
  };

  await sgMail.send(msg);
};

// save OTP to DB with expiry
export const setUserOTP = async (email: string, otp: string) => {
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const user = await User.findOneAndUpdate(
    { email },
    { otp, otpExpiry: expiry },
    { new: true, upsert: true } // create user if not exists
  );

  return user;
};

import sgMail from "@sendgrid/mail";
import User from "../models/User.js";

const configureSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not configured');
  }
  sgMail.setApiKey(apiKey);
  return true;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
};

export const sendOTPEmail = async (email: string, otp: string) => {
  configureSendGrid();
  
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM || "papertrailservice123@gmail.com",
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in <b>5 minutes</b>.</p>`,
  };

  await sgMail.send(msg);
};

export const setUserOTP = async (
  email: string,
  otp: string,
  extraData?: { name: string; dob: string }
) => {
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const updateData: any = {
    otp,
    otpExpiry: expiry,
  };

  if (extraData) {
    updateData.name = extraData.name;
    updateData.dob = extraData.dob;
  }

  const user = await User.findOneAndUpdate(
    { email },
    updateData,
    { new: true, upsert: true } // create user if not exists
  );

  return user;
};

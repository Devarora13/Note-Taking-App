import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  dob?: Date;
  email: string;
  otp?: string;
  otpExpiry?: Date;
  googleId?: string;
  isVerified?: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    dob: { type: Date }, // Made optional for Google OAuth users
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
    isVerified: { type: Boolean, default: false }, // Auto true for Google users
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);

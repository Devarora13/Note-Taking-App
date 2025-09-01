import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  dob: Date;
  email: string;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);

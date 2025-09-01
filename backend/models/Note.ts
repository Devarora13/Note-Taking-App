import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", NoteSchema);

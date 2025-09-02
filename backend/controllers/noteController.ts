import type { Request, Response } from "express";
import Note from "../models/Note.js";
import "../types/auth.js"; // Import to ensure type augmentation is loaded

// Create Note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      user: req.user?.id,
      title,
      content,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note" });
  }
};

// Get All Notes for User
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// Delete Note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};

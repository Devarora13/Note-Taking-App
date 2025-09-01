import { Router } from "express";
import { createNote, getNotes, deleteNote } from "../controllers/noteController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createNoteSchema } from "../validators/noteValidator.js";

const router = Router();

router.post("/", protect, validateRequest(createNoteSchema), createNote);
router.get("/", protect, getNotes);
router.delete("/:id", protect, deleteNote);

export default router;

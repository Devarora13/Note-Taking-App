import { Router } from "express";
import { requestOTP, verifyOTP } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { requestOtpSchema, verifyOtpSchema } from "../validators/authValidator.js";


const router = Router();


router.post("/request-otp",validateRequest(requestOtpSchema), requestOTP);

router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOTP);

export default router;

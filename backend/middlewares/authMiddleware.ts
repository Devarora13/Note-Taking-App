import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.js";

const JWT_SECRET: string = process.env.JWT_SECRET || "supersecret";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "id" in decoded &&
      "email" in decoded
    ) {
      req.user = decoded as JwtPayload;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token payload" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

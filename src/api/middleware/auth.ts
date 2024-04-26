import jwt from "jsonwebtoken";
import { config } from "@/config";

export const verifyToken = (req: any, res: any, next: any) => {
  if (req.path === "/auth/login") return next();
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.user = decoded;
    next();
  });
};

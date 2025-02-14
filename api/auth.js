// auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "tu_secreto_super_seguro";

export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

import jwt from "jsonwebtoken";

const SECRET_KEY = "supersecretkey"; // Replace with a secure key

export function generateToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}

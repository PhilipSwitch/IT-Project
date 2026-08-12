import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function generateToken(userId: number, role: string): string {
  return jwt.sign(
    {
      userId,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}
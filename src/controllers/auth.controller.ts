import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword, comparePassword } from "../lib/password";
import { generateToken } from "../lib/jwt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phoneNumber,
        role,
      },
    });

    const token = generateToken(user.id, user.role);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await comparePassword(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
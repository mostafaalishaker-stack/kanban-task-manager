import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function register(req: any, res: Response) {
  const { email, name, password } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "Email already in use" });

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, password: hashed },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

export async function login(req: any, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

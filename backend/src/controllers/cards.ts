import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

export async function createCard(req: AuthRequest, res: Response) {
  const { title, description, columnId, dueDate, labels } = req.body;
  const count = await prisma.card.count({ where: { columnId } });
  const card = await prisma.card.create({
    data: { title, description, columnId, position: count, dueDate: dueDate ? new Date(dueDate) : null, labels: labels || [] },
  });
  res.status(201).json(card);
}

export async function updateCard(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { title, description, dueDate, labels } = req.body;
  const card = await prisma.card.update({
    where: { id },
    data: { title, description, dueDate: dueDate ? new Date(dueDate) : null, labels },
  });
  res.json(card);
}

export async function deleteCard(req: AuthRequest, res: Response) {
  const { id } = req.params;
  await prisma.card.delete({ where: { id } });
  res.status(204).send();
}

export async function moveCard(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { columnId, position } = req.body;
  const card = await prisma.card.update({
    where: { id },
    data: { columnId, position },
  });
  res.json(card);
}

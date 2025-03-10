import type { Type } from "@prisma/client";
import { prisma } from "../database/db";

interface TransactionPayload {
  description: string;
  amount: number;
  type: Type;
  date: string;
  category_id: string;
  bank_id: string | null;
  user_id: string;
}

async function findAll(userId: string, page: number, limit: number) {
  return await prisma.transaction.findMany({
    where: { user_id: userId },
    include: {
      user: { select: { currency: true } },
      category: { select: { name: true, icon: true } },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { date: "desc" },
  });
}

async function find(id: string) {
  return await prisma.transaction.findUnique({
    where: { id: id },
  });
}

async function save(data: TransactionPayload) {
  return await prisma.transaction.create({
    data: data,
  });
}

async function remove(id: string) {
  return await prisma.transaction.delete({
    where: { id: id },
  });
}

export default {
  findAll,
  find,
  save,
  remove,
};

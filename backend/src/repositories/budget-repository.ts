import { prisma } from "../database/db";

async function findAll(userId: string) {
  return await prisma.budget.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "asc" },
    include: {
      user: { select: { currency: true } },
      category: { select: { name: true, icon: true } },
    },
  });
}

async function find(id: string) {
  return await prisma.budget.findUnique({
    where: { id: id },
  });
}

async function save(
  userId: string,
  limit: number,
  spend: number,
  categoryId: string,
) {
  return await prisma.budget.create({
    data: {
      limit: limit,
      spend: spend,
      category_id: categoryId,
      user_id: userId,
    },
    include: {
      user: { select: { currency: true } },
      category: { select: { name: true, icon: true } },
    },
  });
}

async function update(id: string, limit: number) {
  return await prisma.budget.update({
    where: { id: id },
    data: {
      limit: limit,
    },
  });
}

async function remove(id: string) {
  return await prisma.budget.delete({
    where: { id: id },
  });
}

export default {
  findAll,
  find,
  save,
  update,
  remove,
};

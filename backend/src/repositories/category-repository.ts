import type { Type } from "@prisma/client";
import { prisma } from "../database/db";

interface CategoryPayload {
  name: string;
  icon: string;
  user_id: string;
  type: Type;
}

async function findAll(userId: string) {
  return await prisma.category.findMany({
    where: { user_id: userId, is_archive: false },
    orderBy: { created_at: "desc" },
  });
}

async function find(id: string) {
  return await prisma.category.findUnique({
    where: { id: id },
  });
}

async function save(data: CategoryPayload) {
  return await prisma.category.create({
    data: data,
  });
}

async function archive(id: string) {
  return await prisma.category.update({
    where: { id: id },
    data: {
      is_archive: true,
    },
  });
}

export default {
  findAll,
  find,
  save,
  archive,
};

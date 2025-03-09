import { prisma } from "../database/db";

async function findAll(userId: string) {
  return await prisma.bank.findMany({
    where: { user_id: userId, is_archive: false },
    orderBy: { created_at: "desc" },
  });
}

async function find(id: string) {
  return await prisma.bank.findUnique({
    where: { id: id },
  });
}

async function save(userId: string, bankName: string, accountName: string) {
  return await prisma.bank.create({
    data: {
      bank_name: bankName,
      account_name: accountName,
      user_id: userId,
    },
  });
}

async function archive(id: string) {
  return await prisma.bank.update({
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

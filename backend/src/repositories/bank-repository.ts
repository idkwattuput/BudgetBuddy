import { prisma } from "../database/db";

async function findAll(userId: string) {
  return await prisma.bank.findMany({
    where: { user_id: userId },
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

async function remove(id: string) {
  return await prisma.bank.delete({
    where: { id: id },
  });
}

export default {
  findAll,
  find,
  save,
  remove,
};

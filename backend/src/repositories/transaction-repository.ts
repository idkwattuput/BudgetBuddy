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

async function bankStats(userId: string) {
  return await prisma.$transaction(async (p) => {
    const bankSum = await p.transaction.groupBy({
      by: ["bank_id"],
      where: { user_id: userId, type: "EXPENSE" },
      _sum: { amount: true },
      orderBy: { bank_id: "asc" },
      take: 5,
    });
    let bankStats = [];
    for (let i = 0; i < bankSum.length; i++) {
      if (bankSum[i].bank_id) {
        const category = await p.bank.findUnique({
          where: { id: bankSum[i].bank_id },
          select: { bank_name: true },
        });
        bankStats.push({
          amount: bankSum[i]._sum.amount,
          bank_name: category?.bank_name || null,
        });
      }
    }
    return bankStats;
  });
}

async function categoryStats(userId: string) {
  return await prisma.$transaction(async (p) => {
    const categorySum = await p.transaction.groupBy({
      by: ["category_id"],
      where: { user_id: userId, type: "EXPENSE" },
      _sum: { amount: true },
      orderBy: { category_id: "asc" },
      take: 5,
    });
    let categoryStats = [];
    for (let i = 0; i < categorySum.length; i++) {
      const category = await p.category.findUnique({
        where: { id: categorySum[i].category_id },
        select: { name: true },
      });
      categoryStats.push({
        amount: categorySum[i]._sum.amount,
        category: category?.name || null,
      });
    }
    return categoryStats;
  });
}

async function overviewStats(userId: string, startDate: Date, endDate: Date) {
  return await prisma.$transaction(async (p) => {
    const overview = await p.transaction.groupBy({
      by: ["type"],
      where: { user_id: userId, date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });
    const currency = await p.user.findUnique({
      where: { id: userId },
      select: { currency: true },
    });
    return {
      currency: currency?.currency,
      income: overview[0].type === "INCOME" ? overview[0]._sum.amount : 0,
      expense:
        overview[0].type === "EXPENSE"
          ? overview[0]._sum.amount
          : overview[1]?.type === "EXPENSE"
            ? overview[1]._sum.amount
            : 0,
    };
  });
}

async function yearStats(userId: string, startDate: Date, endDate: Date) {
  return await prisma.transaction.findMany({
    where: { user_id: userId, date: { gte: startDate, lte: endDate } },
    select: { amount: true, type: true, date: true },
    orderBy: { date: "asc" },
  });
}

async function findAll(userId: string, page: number, limit: number) {
  return await prisma.transaction.findMany({
    where: { user_id: userId },
    include: {
      user: { select: { currency: true } },
      category: { select: { name: true, icon: true } },
      bank: { select: { bank_name: true } },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { date: "desc" },
  });
}

async function totalAmountByCategory(
  categoryId: string,
  startDate: Date,
  endDate: Date,
) {
  return await prisma.transaction.aggregate({
    where: {
      category_id: categoryId,
      date: { gte: startDate, lte: endDate },
      type: "EXPENSE",
    },
    _sum: {
      amount: true,
    },
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
  bankStats,
  categoryStats,
  overviewStats,
  yearStats,
  findAll,
  find,
  totalAmountByCategory,
  save,
  remove,
};

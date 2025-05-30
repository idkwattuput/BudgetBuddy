import type { Request, Response, NextFunction } from "express";
import transactionRepository from "../repositories/transaction-repository";
import { getMonth, getYear } from "date-fns";
import budgetRepository from "../repositories/budget-repository";

async function getBankStats(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const bankStats = await transactionRepository.bankStats(userId);
    return res.json({ data: bankStats });
  } catch (error) {
    next(error);
  }
}

async function getCategoryStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const categoryStats = await transactionRepository.categoryStats(userId);
    return res.json({ data: categoryStats });
  } catch (error) {
    next(error);
  }
}

async function getOverviewStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const currentMonth = getMonth(new Date()) + 1;
    const currentYear = getYear(new Date());
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 1);
    const overviewStats = await transactionRepository.overviewStats(
      userId,
      startDate,
      endDate,
    );
    return res.json({ data: overviewStats });
  } catch (error) {
    next(error);
  }
}

async function getTransactionStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const year = Number(req.query.year) || getYear(new Date());
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const yearStats = await transactionRepository.yearStats(
      userId,
      startDate,
      endDate,
    );
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i, 1).toLocaleString("default", { month: "long" }),
      income: 0,
      expense: 0,
    }));
    yearStats.forEach(({ amount, type, date }) => {
      const monthIndex = new Date(date).getMonth();
      if (type === "INCOME") {
        monthlyStats[monthIndex].income += Number(amount);
      } else if (type === "EXPENSE") {
        monthlyStats[monthIndex].expense += Number(amount);
      }
    });
    return res.json({ data: monthlyStats });
  } catch (error) {
    next(error);
  }
}

async function getTransactions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const categoryIds = req.query.categoryIds;
    const bankIds = req.query.bankIds;
    const types = req.query.types;
    const from = req.query.from;
    const to = req.query.to;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const transactions = await transactionRepository.findAll(
      userId,
      page,
      limit,
      from,
      to,
      categoryIds,
      bankIds,
      types,
    );
    return res.json({ data: transactions });
  } catch (error) {
    next(error);
  }
}

async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const { description, amount, type, date, categoryId, bankId } = req.body;
    if (
      !description ||
      typeof description !== "string" ||
      !amount ||
      typeof amount !== "number" ||
      (type !== "EXPENSE" && type !== "INCOME") ||
      !date ||
      !categoryId ||
      typeof categoryId !== "string"
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isBudgetExist = await budgetRepository.findByCategory(
      categoryId,
      userId,
    );
    if (isBudgetExist) {
      await budgetRepository.updateSpend(isBudgetExist.id, amount);
    }
    const transactionPayload = {
      user_id: userId,
      description,
      amount,
      type,
      date,
      category_id: categoryId,
      bank_id: bankId || null,
    };
    const newTransaction = await transactionRepository.save(transactionPayload);
    return res.json({ data: newTransaction });
  } catch (error) {
    next(error);
  }
}

async function deleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    const isTransactionExist = await transactionRepository.find(id);
    if (!isTransactionExist) {
      return res.status(404).json({ data: "Transaction doesn't exist" });
    }
    await transactionRepository.remove(id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default {
  getBankStats,
  getCategoryStats,
  getOverviewStats,
  getTransactionStats,
  getTransactions,
  createTransaction,
  deleteTransaction,
};

import type { Request, Response, NextFunction } from "express";
import budgetRepository from "../repositories/budget-repository";
import categoryRepository from "../repositories/category-repository";
import transactionRepository from "../repositories/transaction-repository";
import { getMonth, getYear } from "date-fns";

async function getBudgets(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const budgets = await budgetRepository.findAll(userId);
    return res.json({ data: budgets });
  } catch (error) {
    next(error);
  }
}

async function createBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { limit, categoryId } = req.body;
    if (!limit || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isCategoryExist = await categoryRepository.find(categoryId);
    if (!isCategoryExist) {
      return res.status(404).json({ message: "Category doesn't exist" });
    }
    const currentMonth = getMonth(new Date()) + 1;
    const currentYear = getYear(new Date());
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 1);
    const expenseByCategory = await transactionRepository.totalAmountByCategory(
      categoryId,
      startDate,
      endDate,
    );
    const spend =
      Number(limit) > Number(expenseByCategory._sum.amount)
        ? Number(expenseByCategory._sum.amount)
        : Number(limit);
    const newBudget = await budgetRepository.save(
      userId,
      limit,
      spend,
      categoryId,
    );
    return res.status(201).json({ data: newBudget });
  } catch (error) {
    next(error);
  }
}

async function updateBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const { limit } = req.body;
    if (!limit) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isBudgetExist = await budgetRepository.find(id);
    if (!isBudgetExist) {
      return res.status(404).json({ message: "Budget doesn't exist" });
    }
    const updatedBudget = await budgetRepository.update(id, limit);
    return res.json({ data: updatedBudget });
  } catch (error) {
    next(error);
  }
}

async function deleteBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const isBudgetExist = await budgetRepository.find(id);
    if (!isBudgetExist) {
      return res.status(404).json({ message: "Budget doesn't exist" });
    }
    await budgetRepository.remove(id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};

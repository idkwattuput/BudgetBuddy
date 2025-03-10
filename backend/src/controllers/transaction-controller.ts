import type { Request, Response, NextFunction } from "express";
import transactionRepository from "../repositories/transaction-repository";

async function getTransactions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const transactions = await transactionRepository.findAll(
      userId,
      page,
      limit,
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
  getTransactions,
  createTransaction,
  deleteTransaction,
};

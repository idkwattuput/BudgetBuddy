import type { Request, Response, NextFunction } from "express";
import categoryRepository from "../repositories/category-repository";

async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const categories = await categoryRepository.findAll(userId);
    return res.json({ data: categories });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { name, icon, type } = req.body;
    if (
      typeof userId !== "string" ||
      !name ||
      typeof name !== "string" ||
      !icon ||
      typeof icon !== "string" ||
      (type !== "EXPENSE" && type !== "INCOME")
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const categoryPayload = {
      name,
      icon,
      type,
      user_id: userId,
    };
    const newCategory = await categoryRepository.save(categoryPayload);
    return res.status(201).json({ data: newCategory });
  } catch (error) {
    next(error);
  }
}

async function archiveCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    const isCategoryExist = await categoryRepository.find(id);
    if (!isCategoryExist) {
      return res.status(404).json({ message: "Category doesn't exist" });
    }
    await categoryRepository.archive(id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default {
  getCategories,
  createCategory,
  archiveCategory,
};

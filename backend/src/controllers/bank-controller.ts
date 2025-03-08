import type { Request, Response, NextFunction } from "express";
import bankRepository from "../repositories/bank-repository";

async function getBanks(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const banks = await bankRepository.findAll(userId);
    return res.json({ data: banks });
  } catch (error) {
    next(error);
  }
}

async function createBank(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { bankName, accountName } = req.body;
    if (!bankName || !accountName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newBank = await bankRepository.save(userId, bankName, accountName);
    return res.status(201).json({ data: newBank });
  } catch (error) {
    next(error);
  }
}

async function deleteBank(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const isBankExist = await bankRepository.find(id);
    if (!isBankExist) {
      return res.status(404).json({ message: "Bank doesn't exist" });
    }
    await bankRepository.remove(id);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default {
  getBanks,
  createBank,
  deleteBank,
};

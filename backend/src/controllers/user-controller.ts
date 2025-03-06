import type { Request, Response, NextFunction } from "express";
import userRepository from "../repositories/user-repository";

async function updateCurrency(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { currency } = req.body;
    if (!currency) {
      return res.status(400).json({ message: "All field are required" });
    }
    const updatedUser = await userRepository.updateCurrency(userId, currency);
    return res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
}

export default {
  updateCurrency,
};

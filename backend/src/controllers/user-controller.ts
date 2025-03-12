import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import userRepository from "../repositories/user-repository";

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const user = await userRepository.find(userId);
    return res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function updateInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "All field are required" });
    }
    const isUserExist = await userRepository.find(userId);
    if (!isUserExist) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    if (isUserExist.email !== email) {
      const isEmailDuplicate = await userRepository.findByEmail(email);
      if (isEmailDuplicate) {
        return res.status(409).json({ message: "Email already exist" });
      }
    }
    const updatedUser = await userRepository.updateInfo(
      userId,
      firstName,
      lastName,
      email,
    );
    return res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isUserExist = await userRepository.findPasswordByUserId(userId);
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      isUserExist.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await userRepository.updatePassword(
      userId,
      hashPassword,
    );
    return res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
}

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
  getUser,
  updateInfo,
  updatePassword,
  updateCurrency,
};

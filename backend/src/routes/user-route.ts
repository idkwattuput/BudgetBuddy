import express from "express";
import userController from "../controllers/user-controller";

const userRouter = express.Router();

userRouter.route("/currency").put(userController.updateCurrency);

export default userRouter;

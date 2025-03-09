import express from "express";
import userController from "../controllers/user-controller";

const userRouter = express.Router();

userRouter.route("/").put(userController.updateInfo);
userRouter.route("/password").put(userController.updatePassword);
userRouter.route("/currency").put(userController.updateCurrency);

export default userRouter;

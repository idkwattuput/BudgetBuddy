import express from "express";
import transactionController from "../controllers/transaction-controller";

const transactionRouter = express.Router();

transactionRouter
  .route("/")
  .get(transactionController.getTransactions)
  .post(transactionController.createTransaction);
transactionRouter.route("/:id").delete(transactionController.deleteTransaction);

export default transactionRouter;

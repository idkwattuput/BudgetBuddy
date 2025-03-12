import express from "express";
import transactionController from "../controllers/transaction-controller";

const transactionRouter = express.Router();

transactionRouter
  .route("/")
  .get(transactionController.getTransactions)
  .post(transactionController.createTransaction);
transactionRouter.route("/bank").get(transactionController.getBankStats);
transactionRouter
  .route("/category")
  .get(transactionController.getCategoryStats);
transactionRouter
  .route("/overview")
  .get(transactionController.getOverviewStats);
transactionRouter
  .route("/history")
  .get(transactionController.getTransactionStats);
transactionRouter.route("/:id").delete(transactionController.deleteTransaction);

export default transactionRouter;

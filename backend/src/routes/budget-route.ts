import express from "express";
import budgetController from "../controllers/budget-controller";

const budgetRouter = express.Router();

budgetRouter
  .route("/")
  .get(budgetController.getBudgets)
  .post(budgetController.createBudget);
budgetRouter
  .route("/:id")
  .put(budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

export default budgetRouter;

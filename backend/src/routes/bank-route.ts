import express from "express";
import bankController from "../controllers/bank-controller";

const bankRouter = express.Router();

bankRouter
  .route("/")
  .get(bankController.getBanks)
  .post(bankController.createBank);
bankRouter.route("/:id").delete(bankController.archiveBank);

export default bankRouter;

import express from "express";
import categoryController from "../controllers/category-controller";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);
categoryRouter.route("/:id").delete(categoryController.archiveCategory);

export default categoryRouter;

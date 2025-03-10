import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./middlewares/log";
import { verifyJWT } from "./middlewares/jwt";
import authRouter from "./routes/auth-route";
import { credentials } from "./middlewares/credentials";
import { corsOptions } from "./config/cors-options";
import { errorHandler } from "./middlewares/error";
import userRouter from "./routes/user-route";
import bankRouter from "./routes/bank-route";
import transactionRouter from "./routes/transaction-route";
import budgetRouter from "./routes/budget-route";
import categoryRouter from "./routes/category-route";

export const app = express();
const PORT = Bun.env.PORT! || 8000;

// Middlewares
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes that dont need verify JWT
app.use("/api/v1/auth", authRouter);

app.use(verifyJWT);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/banks", bankRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/category", categoryRouter);

// Handling non-existent routes
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Make sure errorHandler is called last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});

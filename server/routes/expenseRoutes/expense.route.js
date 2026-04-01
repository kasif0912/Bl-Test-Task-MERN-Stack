import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  createExpense,
  getGroupBalances,
  getGroupExpenses,
} from "../../controller/expense.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createExpense);
router.get("/:groupId", authMiddleware, getGroupExpenses);
router.get("/:groupId/balances", authMiddleware, getGroupBalances);

export default router;
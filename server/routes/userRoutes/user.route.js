import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { getAllUsers } from "../../controller/user.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);

export default router;
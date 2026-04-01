import "dotenv/config";
import express from "express";
import connectDB from "./db/connection.js";
import cors from "cors";
import authRoutes from "./routes/auth/auth.route.js";
import userRoutes from "./routes/userRoutes/user.route.js";
import groupRoutes from "./routes/groupRoutes/group.route.js";
import expenseRoutes from "./routes/expenseRoutes/expense.route.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jade-dolphin-f29338.netlify.app",
    ],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("hello server :)");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

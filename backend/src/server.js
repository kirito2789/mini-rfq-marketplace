import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import rfqRoutes from "./routes/rfqRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "RFQMarket API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/quotations", quotationRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
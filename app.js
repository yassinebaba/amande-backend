// backend/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookRoutes from "./routes/book.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", bookRoutes);
app.use("/api/admin", adminRoutes);

export default app;

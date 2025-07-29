// backend/routes/admin.js

// backend/routes/admin.js

import express from "express";
import { loginAdmin, getAllReservations } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Authentification admin
router.post("/login", loginAdmin);

// ✅ Route protégée : récupère toutes les réservations
router.get("/reservations", verifyAdmin, getAllReservations);

export default router;


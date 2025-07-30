// backend/routes/book.js

import express from "express";
import {
  createBooking,
  getOccupiedEstheticiennes,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/book
router.post("/book", createBooking);

// GET /api/bookings?date=YYYY-MM-DD&time=HH:mm
router.get("/bookings", getOccupiedEstheticiennes);

// PATCH /api/book/:id → admin uniquement
router.patch("/book/:id", verifyAdmin, updateBookingStatus);

export default router;





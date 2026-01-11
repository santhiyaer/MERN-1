import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new booking
router.post("/", verifyToken, createBooking);

// ✅ Get all bookings (admin or test)
router.get("/", verifyToken, getAllBookings);

// ✅ Get current user's bookings
router.get("/user", verifyToken, getUserBookings);

// ✅ Update booking status by ID
router.put("/:id", verifyToken, updateBooking);

// ✅ Delete booking by ID
router.delete("/:id", verifyToken, deleteBooking);

export default router;

import express from "express";
import {
  createBooking,
  getUserBookings,
  updateBookingStatus,
} 
from "../controllers/intController.js"; 
const router = express.Router();

router.post("/", createBooking);
router.get("/:userId", getUserBookings);
router.put("/:id", updateBookingStatus);

export default router;

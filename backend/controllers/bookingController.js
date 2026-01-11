import Booking from "../models/intBooking.js";

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  try {
    // Ensure correct key names match your schema
    const newBooking = new Booking({
      userId: req.user.id,       // ✅ correctly map logged-in user
      postId: req.body.postId,   // ✅ get postId from body
      status: "pending",         // default
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
};

// ✅ Get all bookings (for admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username email")
      .populate("postId", "title location");
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// ✅ Get logged-in user's own bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate("postId", "title location");
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
};

// ✅ Update booking status (example: accept/reject)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status || booking.status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
};

import Booking from "../models/intBooking.js"; 

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const newBooking = new Booking({ userId, postId });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("postId")
      .populate("userId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Update booking status (accept/reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error });
  }
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [navigate, token]);

  if (!bookings.length)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <h2 className="text-2xl font-semibold mb-3">No Bookings Yet 😕</h2>
        <button
          onClick={() => navigate("/posts")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Browse Gigs
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">My Bookings 📅</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <h2 className="text-lg font-semibold mb-2">
              {booking.postId?.title || "Gig Title"}
            </h2>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Booked By:</span>{" "}
              {booking.userId?.name || "User"}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Date:</span>{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </p>
            <p
              className={`mt-3 px-3 py-1 rounded-full text-center text-sm font-semibold ${
                booking.status === "pending"
                  ? "bg-yellow-200 text-yellow-700"
                  : booking.status === "accepted"
                  ? "bg-green-200 text-green-700"
                  : "bg-red-200 text-red-700"
              }`}
            >
              {booking.status.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;

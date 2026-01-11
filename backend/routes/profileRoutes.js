// import express from "express";
// import verifyToken from "../middleware/authMiddleware.js"; 
// import Freelancer from "../models/Freelancer.js";
// import Client from "../models/Client.js";
// import Gig from "../models/Gig.js";

// const router = express.Router();

// //  Get logged-in user's profile
// router.get("/me", verifyToken, async (req, res) => {
//   try {
//     if (req.user.role === "client") {
//       const client = await Client.findById(req.user.id).select("-password");
//       return res.json(client);
//     } else {
//       const freelancer = await Freelancer.findById(req.user.id).select("-password");
//       return res.json(freelancer);
//     }
//   } catch (err) {
//     console.error("Error fetching profile:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Get gigs applied by freelancer
// router.get("/freelancer/:id/applied", async (req, res) => {
//   try {
//     const freelancer = await Freelancer.findById(req.params.id).populate({
//       path: "appliedGigs",
//       populate: { path: "client", select: "name companyName" },
//     });
//     if (!freelancer) return res.json([]);
//     res.json(freelancer.appliedGigs || []);
//   } catch (err) {
//     console.error("Error fetching applied gigs:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router; 




import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { getMyProfile, updateMyProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);

// Accept profilePhoto and resume 
router.put(
  "/me",
  verifyToken,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateMyProfile
);

export default router;


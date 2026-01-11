import Freelancer from "../models/Freelancer.js";
import Client from "../models/Client.js";


//  * GET /api/profile/me
 
export const getMyProfile = async (req, res) => {
  try {
    if (req.user.role === "freelancer") {
      const f = await Freelancer.findById(req.user.id).select("-password");
      return res.json(f);
    } else {
      const c = await Client.findById(req.user.id).select("-password");
      return res.json(c);
    }
  } catch (err) {
    console.error("getMyProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


//  * PUT /api/profile/me

export const updateMyProfile = async (req, res) => {
  try {
    const updates = {};

    // Basic text fields
    const fields = [
      "name",
      "phone",
      "email",
      "location",
      "education",
      "preferredSalary",
      "resumeHeadline",
      "availableToJoin",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // skills/languages: convert CSV -> array
    if (req.body.skills) {
      updates.skills = req.body.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (req.body.languages) {
      updates.languages = req.body.languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Files handled by multer 
    if (req.files) {
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        updates.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
      }
      if (req.files.resume && req.files.resume[0]) {
        updates.resume = `/uploads/${req.files.resume[0].filename}`;
      }
    }

    let model;
    if (req.user.role === "freelancer") {
      model = await Freelancer.findByIdAndUpdate(req.user.id, updates, {
        new: true,
      }).select("-password");
    } else {
      model = await Client.findByIdAndUpdate(req.user.id, updates, {
        new: true,
      }).select("-password");
    }

    if (!model) return res.status(404).json({ message: "Profile not found" });

    return res.json(model);
  } catch (err) {
    console.error("updateMyProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

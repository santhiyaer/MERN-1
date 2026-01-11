import express from "express";
import {
  sendRequest,
  getRequests,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", verifyToken, sendRequest);
router.get("/", verifyToken, getRequests);
router.put("/:id", verifyToken, updateRequest);
router.delete("/:id", verifyToken, deleteRequest);

export default router;

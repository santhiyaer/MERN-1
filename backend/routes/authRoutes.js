import express from "express";
import { registerClient, registerFreelancer, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register/client', registerClient);
router.post('/register/freelancer', registerFreelancer);
router.post('/login', login);

export default router;



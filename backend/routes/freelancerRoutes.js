import express from 'express';
import { getFreelancerProfile, getFreelancerAppliedGigs } from '../controllers/freelancerController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /freelancer/me  -> profile of logged-in freelancer
router.get('/me', verifyToken, getFreelancerProfile);

// GET /freelancer/:id/applied  -> applied gigs for freelancer id (public for owner or admin)
router.get('/:id/applied', verifyToken, getFreelancerAppliedGigs);

export default router;

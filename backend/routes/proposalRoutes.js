import express from 'express';
import { submitProposal, getProposalsForGig, getProposalById, hireProposal } from '../controllers/proposalController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// apply to gig - freelancer only
router.post('/:id/apply', auth, submitProposal);

// list proposals for a gig - client or admin 
router.get('/gig/:id', auth, getProposalsForGig);

// GET a proposal by ID
router.get("/:id",auth, getProposalById);

// POST hire a proposal
router.post("/:id/hire",auth, hireProposal);

export default router;

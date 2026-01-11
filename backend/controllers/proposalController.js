import Proposal from '../models/Proposal.js';
import Gig from '../models/Gig.js';
import Freelancer from '../models/Freelancer.js';
import mongoose from 'mongoose';

// Submit a new proposal
export const submitProposal = async (req, res) => {
  try {
    const gigId = req.params.id;
    const { message } = req.body;

    if (req.user.role !== 'freelancer')
      return res.status(403).json({ message: 'Only freelancers can apply' });

    const p = await Proposal.create({
      gig: gigId,
      freelancer: req.user.id,
      message
    });

    await Freelancer.findByIdAndUpdate(req.user.id, { $addToSet: { appliedGigs: gigId } });

    res.status(201).json(p);
  } catch (err) {
    console.error('submitProposal', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a proposal by ID
export const getProposalById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid proposal ID" });
  }

  // Find gig that contains this proposal
  const gig = await Gig.findOne({ "proposals._id": id }).populate("proposals.freelancer", "name profilePhoto skills email resume resumeHeadline");
  
  if (!gig) return res.status(404).json({ message: "Proposal not found" });

  // Extract proposal from subdocument
  const proposal = gig.proposals.id(id);
  if (!proposal) return res.status(404).json({ message: "Proposal not found" });

  res.json({
    proposal,
    freelancer: proposal.freelancer || null
  });
};

// Hire a freelancer
export const hireProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.status = 'hired';
    await proposal.save();

    res.json({ message: "Freelancer hired successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all proposals for a gig
export const getProposalsForGig = async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const proposals = await Proposal.find({ gig: gigId }).populate(
      "freelancer",
      "name email profilePhoto"
    );
    res.json({ proposals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

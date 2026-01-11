import Freelancer from '../models/Freelancer.js';

// return full freelancer profile (including appliedGigs)
export const getFreelancerProfile = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.user.id).select('-password');
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });
    return res.json(freelancer);
  } catch (err) {
    console.error('getFreelancerProfile error', err);
    return res.status(500).json({ message: 'Failed to load profile' });
  }
};

// return applied gigs for a freelancer (by id)
export const getFreelancerAppliedGigs = async (req, res) => {
  try {
    const id = req.params.id;
    const freelancer = await Freelancer.findById(id).select('appliedGigs');
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });
    return res.json(freelancer.appliedGigs || []);
  } catch (err) {
    console.error('getFreelancerAppliedGigs error', err);
    return res.status(500).json({ message: 'Failed to load applied gigs' });
  }
};

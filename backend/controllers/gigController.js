// import fs from 'fs';
// import path from 'path';
// import Gig from '../models/Gig.js';
// import Freelancer from '../models/Freelancer.js';
// import Client from '../models/Client.js';

// /**
//  * List public gigs
//  */
// export const listGigs = async (req, res) => {
//   try {
//     const gigs = await Gig.find().populate('client', 'name profilePhoto').sort({ createdAt: -1 });
//     res.json(gigs);
//   } catch (err) {
//     console.error('listGigs error', err);
//     res.status(500).json({ message: 'Failed to list gigs' });
//   }
// };

// /**
//  * Create gig (client)
//  * Expects upload.single('photo') handled in routes when needed
//  */
// export const createGig = async (req, res) => {
//   try {
//     const payload = {
//       client: req.user?.id || req.body.client,
//       title: req.body.title,
//       companyName: req.body.companyName,
//       location: req.body.location,
//       skills: req.body.skills ? (Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim())) : [],
//       budget: req.body.budget,
//       description: req.body.description,
//     };

//     if (req.file) {

//       // store relative path to file (frontend resolve helper will prefix base url)
//       payload.photo = `/uploads/${req.file.filename}`;
//     } else if (req.body.photo) {
//       payload.photo = req.body.photo;
//     }

//     const gig = new Gig(payload);
//     await gig.save();
//     res.status(201).json(gig);
//   } catch (err) {
//     console.error('createGig error', err);
//     res.status(500).json({ message: 'Failed to create gig' });
//   }
// };

// /**
//  * List gigs created by currently authenticated client
//  */
// export const listMyGigs = async (req, res) => {
//   try {
//     const clientId = req.user?.id;
//     if (!clientId) return res.status(401).json({ message: 'Unauthorized' });
//     const gigs = await Gig.find({ client: clientId }).sort({ createdAt: -1 });
//     res.json(gigs);
//   } catch (err) {
//     console.error('listMyGigs error', err);
//     res.status(500).json({ message: 'Failed to list your gigs' });
//   }
// };

// /**
//  * Get single gig details (includes proposals)
//  */
// export const getGig = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const gig = await Gig.findById(id)
//       .populate('client', 'name profilePhoto')
//       .populate('proposals.freelancer', 'name profilePhoto skills preferredSalary rating resume'); // optional populate
//     if (!gig) return res.status(404).json({ message: 'Gig not found' });
//     res.json(gig);
//   } catch (err) {
//     console.error('getGig error', err);
//     res.status(500).json({ message: 'Failed to load gig' });
//   }
// };



// // DELETE a gig by ID
// export const deleteGig = async (req, res) => {
//   try {
//     const gig = await Gig.findById(req.params.id);

//     if (!gig) {
//       return res.status(404).json({ message: "Gig not found" });
//     }

//     await Gig.findByIdAndDelete(req.params.id);

//     res.status(200).json({ message: "Gig deleted successfully" });
//   } catch (error) {
//     console.error("deleteGig error", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// /**
//  * Apply to a gig (freelancer)
//  * Route: POST /gigs/:id/apply (verifyToken)
//  * Body may include optional: coverLetter, expectedSalary, days
//  */
// export const applyToGig = async (req, res) => {
//   try {
//     const gigId = req.params.id;
//     const freelancerId = req.user?.id;

//     if (!freelancerId) return res.status(401).json({ message: 'Unauthorized' });

//     const gig = await Gig.findById(gigId);
//     if (!gig) return res.status(404).json({ message: 'Gig not found' });

//     // load freelancer profile
//     const freelancer = await Freelancer.findById(freelancerId);
//     if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });

//     // Avoid duplicate applications
//     const already = gig.proposals?.some(p => String(p.freelancer) === String(freelancerId));
//     if (already) return res.status(400).json({ message: 'You already applied to this gig' });

//     // Build appliedGigs entry for freelancer (store gig snapshot)
//     const appliedEntry = {
//       gigId: String(gig._id),
//       title: gig.title,
//       companyName: gig.companyName || (gig.client && gig.client.name) || '',
//       photo: gig.photo || gig.image || '',
//       budget: gig.budget,
//       location: gig.location,
//       description: gig.description,
//       appliedAt: new Date(),
//     };

//     // push to freelancer.appliedGigs (save snapshot)
//     freelancer.appliedGigs = freelancer.appliedGigs || [];
//     freelancer.appliedGigs.push(appliedEntry);
//     await freelancer.save();

//     // Build proposal object for gig
//     const proposal = {
//       freelancer: freelancer._id,
//       name: freelancer.name,
//       avatar: freelancer.profilePhoto || '',
//       skills: freelancer.skills || [],
//       resume: freelancer.resume || '',
//       expectedSalary: req.body.expectedSalary ?? freelancer.preferredSalary ?? null,
//       rating: freelancer.rating ?? null,
//       days: req.body.days ?? 5,
//       coverLetter: req.body.coverLetter ?? req.body.message ?? '',
//       createdAt: new Date(),
//     };

//     // push to gig.proposals and save
//     gig.proposals = gig.proposals || [];
//     gig.proposals.push(proposal);
//     await gig.save();

//     // return both updated gig & updated freelancer appliedGigs count
//     res.json({
//       message: 'Applied successfully',
//       applied: appliedEntry,
//       proposal,
//     });
//   } catch (err) {
//     console.error('applyToGig error', err);
//     res.status(500).json({ message: 'Failed to apply to gig' });
//   }
// };



import Proposal from "../models/Proposal.js";
import fs from 'fs';
import path from 'path';
import Gig from '../models/Gig.js';
import Freelancer from '../models/Freelancer.js';
import Client from '../models/Client.js';

/**
 * List public gigs
 */
export const listGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate('client', 'name profilePhoto').sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    console.error('listGigs error', err);
    res.status(500).json({ message: 'Failed to list gigs' });
  }
};

/**
 * Create gig (client)
 * Expects upload.single('photo') handled in routes when needed
 */
export const createGig = async (req, res) => {
  try {
    const payload = {
      client: req.user?.id || req.body.client,
      title: req.body.title,
      companyName: req.body.companyName,
      location: req.body.location,
      skills: req.body.skills
        ? (Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim()))
        : [],
      budget: req.body.budget,
      description: req.body.description,
    };

    if (req.file) {
      // store relative path to file (frontend resolve helper will prefix base url)
      payload.photo = `/uploads/${req.file.filename}`;
    } else if (req.body.photo) {
      payload.photo = req.body.photo;
    }

    const gig = new Gig(payload);
    await gig.save();
    res.status(201).json(gig);
  } catch (err) {
    console.error('createGig error', err);
    res.status(500).json({ message: 'Failed to create gig' });
  }
};

/**
 * List gigs created by currently authenticated client
 */
export const listMyGigs = async (req, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) return res.status(401).json({ message: 'Unauthorized' });
    const gigs = await Gig.find({ client: clientId }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    console.error('listMyGigs error', err);
    res.status(500).json({ message: 'Failed to list your gigs' });
  }
};

export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('client', 'name profilePhoto') // client info
      .populate({
        path: 'proposals',                     // populate proposals array
        populate: { 
          path: 'freelancer',                  // populate each proposal's freelancer
          select: 'name profilePhoto skills preferredSalary rating completedJobs resume resumeHeadline email phone education languages' 
        }
      });

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    res.json(gig); // send full gig with populated proposals
  } catch (err) {
    console.error('getGig error', err);
    res.status(500).json({ message: 'Failed to load gig' });
  }
};


// DELETE a gig by ID
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    console.error("deleteGig error", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Apply to a gig (freelancer)
 * Route: POST /gigs/:id/apply (verifyToken)
 * Body may include optional: coverLetter, expectedSalary (amount), days
 *
 * This version:
 *  - prevents duplicate applications by same freelancer
 *  - copies freelancer details (email, phone, resume, skills...) into the gig.proposals entry
 *  - saves a snapshot object into freelancer.appliedGigs
 */
export const applyToGig = async (req, res) => {
  try {
    const gigId = req.params.id;
    const freelancerId = req.user?.id;

    if (!freelancerId) return res.status(401).json({ message: 'Unauthorized' });

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // load freelancer profile (not excluding fields so we can copy)
    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });

    // Avoid duplicate applications
    const already = gig.proposals?.some(p => String(p.freelancer) === String(freelancerId));
    if (already) return res.status(400).json({ message: 'You already applied to this gig' });

    // Build appliedGigs entry for freelancer (store gig snapshot)
    const appliedEntry = {
      gigId: String(gig._id),
      title: gig.title,
      companyName: gig.companyName || (gig.client && gig.client.name) || '',
      photo: gig.photo || gig.image || '',
      budget: gig.budget,
      location: gig.location,
      description: gig.description,
      appliedAt: new Date(),
    };

    // push to freelancer.appliedGigs (save snapshot)
    freelancer.appliedGigs = freelancer.appliedGigs || [];
    freelancer.appliedGigs.push(appliedEntry);
    await freelancer.save();

    // Build proposal object for gig (copy freelancer details here)
    const proposal = {
      freelancer: freelancer._id,
      name: freelancer.name,
      avatar: freelancer.profilePhoto || '',
      email: freelancer.email || '',
      phone: freelancer.phone || '',
      skills: freelancer.skills || [],
      resume: freelancer.resume || '',
      resumeHeadline: freelancer.resumeHeadline || '',
      education: freelancer.education || '',
      languages: freelancer.languages || [],
      amount: req.body.amount ?? freelancer.preferredSalary ?? gig.budget ?? null,
      days: req.body.days ?? 5,
      coverLetter: req.body.coverLetter ?? req.body.message ?? '',
      createdAt: new Date(),
      status: 'pending'
    };

    // push to gig.proposals and save
    gig.proposals = gig.proposals || [];
    gig.proposals.push(proposal);
    await gig.save();

    // return both updated gig & created proposal (send back the last pushed proposal)
    const createdProposal = gig.proposals[gig.proposals.length - 1];
    return res.status(201).json({
      message: 'Applied successfully',
      applied: appliedEntry,
      proposal: createdProposal
    });
  } catch (err) {
    console.error('applyToGig error', err);
    res.status(500).json({ message: 'Failed to apply to gig' });
  }
};


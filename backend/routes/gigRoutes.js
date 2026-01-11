import express from 'express';
import multer from 'multer';
import path from 'path';
import { createGig, listGigs, getGig, deleteGig, listMyGigs,  applyToGig,  } from '../controllers/gigController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// public list
router.get('/', listGigs);

// client: list my gigs
router.get('/me', verifyToken, listMyGigs);

// create
router.post('/create', verifyToken, upload.single('photo'), createGig);

// get details (includes proposals)
router.get('/:id', getGig);

// delete (only owner)
router.delete('/:id', verifyToken, deleteGig);

// apply (freelancer)
router.post('/:id/apply', verifyToken, applyToGig);



export default router;

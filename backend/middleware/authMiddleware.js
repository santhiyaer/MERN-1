import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';
import Freelancer from '../models/Freelancer.js';

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;
    if (!role) return res.status(401).json({ message: 'Invalid token' });

    let user = null;
    if (role === 'client') user = await Client.findById(id).select('-password');
    else if (role === 'freelancer') user = await Freelancer.findById(id).select('-password');

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = { id: user._id, role, ...user.toObject() };
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Auth failed' });
  }
};
export default verifyToken; 
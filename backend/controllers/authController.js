import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Client from '../models/Client.js';
import Freelancer from '../models/Freelancer.js';

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

/* Register client */
export const registerClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await Client.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const hashed = await bcrypt.hash(password, 10);
    const client = await Client.create({ name, email, password: hashed });

    const token =  genToken({ id: client._id, role: 'client' });
    res.status(201).json({ token, role: 'client', user: { id: client._id, name: client.name, email: client.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Register freelancer */
export const registerFreelancer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await Freelancer.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const hashed = await bcrypt.hash(password, 10);
    const freelancer = await Freelancer.create({ name, email, password: hashed });

    const token = genToken({ id: freelancer._id, role: 'freelancer' });
    res.status(201).json({ token, role: 'freelancer', user: { id: freelancer._id, name: freelancer.name, email: freelancer.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Login (common) - send role to decide collection */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });

    let user;
    if (role === 'client') user = await Client.findOne({ email });
    else if (role === 'freelancer') user = await Freelancer.findOne({ email });
    else return res.status(400).json({ message: 'Invalid role' });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = genToken({ id: user._id, role });
    res.json({ token, role, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // export const logOut = async (req,res) => {
  //   try{
  //     res.clearCookie("gentoken")
  //     return res.status(200).json({message:"logOut successful"})

  //   }catch(error){
  //     console.log("login error")
  //     return res.status(500).json({message:`LogOut error &{error}`})
  //   }
  // }
};

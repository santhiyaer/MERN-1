 //seed.js — run with `node seed/seed.js` after installing dotenv & mongoose
 
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.create([
    { name:'Client One', email:'client1@gig.com', password: await require('bcryptjs').hash('pass123',10), role:'client', location:'Mumbai' },
    { name:'Freelancer One', email:'free1@gig.com', password: await require('bcryptjs').hash('pass123',10), role:'freelancer', skills:['design'], location:'Mumbai' }
  ]);
  console.log('Seeded');
  process.exit();
}
seed();

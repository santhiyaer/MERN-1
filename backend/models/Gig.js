import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
  name: String,
  avatar: String,

  email: String,
  phone: String,

  skills: [String],
  resume: String,

  resumeHeadline: String,
  education: String,
  languages: [String],
  amount: Number,  

  days: Number,
  coverLetter: String,
  
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' } 
}, { _id: true });

const gigSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  photo: String, 
  title: { type: String, required: true },
  companyName: String,
  location: String,
  skills: [String],
  budget: Number,
  description: String,
  proposals: [proposalSchema],
  createdAt: { type: Date, default: Date.now }
});

const Gig = mongoose.models.Gig || mongoose.model('Gig', gigSchema);
export default Gig;

import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema({
  name:{ type:String, required:true },
  email:{ type:String, required:true, unique:true },
  password:{ type:String, required:true },

  age: Number,
  phone: String,
  skills: [String],
  location: String,

  profilePhoto: String,   
  resume: String,      

  education: String,
  preferredSalary: String,
  languages: [String],

  resumeHeadline: String,    
  availableToJoin: String,

   appliedGigs: [
    {
      gigId: { type: String, required: true },
      title: String,
      companyName: String,
      photo: String,
      budget: Number,
      location: String,
      description: String,
      appliedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now }
});

  
const Freelancer = mongoose.models.Freelancer || mongoose.model('Freelancer', freelancerSchema);
export default Freelancer;
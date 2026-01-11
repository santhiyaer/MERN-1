import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name:{ type:String, required:true },
  email:{ type:String, required:true, unique:true },
  password:{ type:String, required:true },
  createdAt: { type: Date, default: Date.now }
});

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
export default Client;
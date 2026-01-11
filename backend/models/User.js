// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true , trim: true,},
//   email: { type: String, required: true, unique: true, lowercase: true, },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['client','freelancer','admin'], required: true },
//   skills: [String],
//   location: String,
//   rating: { type: Number, default: 0 },
//   portfolio: [String]
// }, { timestamps: true });

// const User = mongoose.models.User || mongoose.model('User', userSchema);
// export default User;
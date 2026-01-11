import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  gigId: String,
  clientId: String,
  freelancerId: String,
  amount: Number,
  currency: { type: String, default: 'inr' },
  status: { type: String, default: 'pending' }, // pending, paid, released, refunded
  stripePaymentIntentId: String,
  createdAt: { type: Date, default: Date.now },
  milestones: [{ title: String, amount: Number, dueDate: Date, status: String }]
});

module.exports = mongoose.model('Order', OrderSchema);

// import  express from'express';
// const  router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// import Order from '../models/Order';

// // create a PaymentIntent and create order in DB as pending
// router.post('/create-payment', async (req, res) => {
//   try {
//     const { gigId, clientId, freelancerId, amount, currency = 'inr', description, milestones } = req.body;

//     // Create Stripe PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount), // in smallest currency unit (e.g., paise)
//       currency,
//       description: description || 'GigConnect escrow payment',
//       metadata: { gigId, clientId, freelancerId }
//     });

//     // Save order in DB
//     const order = new Order({
//       gigId,
//       clientId,
//       freelancerId,
//       amount,
//       currency,
//       stripePaymentIntentId: paymentIntent.id,
//       milestones: milestones || []
//     });
//     await order.save();

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//       orderId: order._id
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;

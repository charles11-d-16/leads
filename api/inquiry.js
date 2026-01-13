import mongoose from 'mongoose';
import { submitInquiry } from '../controllers/inquiryController.js';

// Ensure MongoDB connection (Vercel reconnects per request)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await submitInquiry(req, res);  // call your controller
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

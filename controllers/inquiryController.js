const Inquiry = require('../models/Inquiry');
const StatusHistory = require('../models/StatusHistory');

exports.submitInquiry = async (req, res) => {
  try {
    const inquiry = new Inquiry({
      full_name: req.body.full_name,
      email: req.body.email,
      discovery_platform: req.body.discovery_platform,
      concern_type: req.body.concern_type,
      message: req.body.message
    });

    await inquiry.save();

    // Save initial status history (no changed_by because it's client submission)
    const history = new StatusHistory({
      inquiry_id: inquiry.inquiry_id,
      status: inquiry.status, // "New"
      notes: 'Initial inquiry created',
      change_at: inquiry.status_date
    });

    await history.save();

    // ✅ Instead of redirect, return JSON response
    res.status(201).json({
      success: true,
      inquiry_id: inquiry.inquiry_id,
      name: inquiry.full_name
    });
  } catch (error) {
    console.error('Error saving inquiry or status history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
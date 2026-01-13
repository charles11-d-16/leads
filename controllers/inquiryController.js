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

    // Redirect back to index.html with success modal params
    res.redirect(`/index.html?success=true&name=${encodeURIComponent(inquiry.full_name)}&ref=${inquiry.inquiry_id}`);
  } catch (error) {
    console.error('Error saving inquiry or status history:', error);
    res.status(500).send('Error submitting inquiry');
  }
};
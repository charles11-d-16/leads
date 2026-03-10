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

    const history = new StatusHistory({
      inquiry_id: inquiry.inquiry_id,
      status: inquiry.status,
      notes: inquiry.message,
      change_at: inquiry.status_date
    });

    await history.save();

    const responsePayload = {
      success: true,
      inquiry_id: inquiry.inquiry_id,
      name: inquiry.full_name
    };

    const acceptsHtml = req.accepts(['html', 'json']) === 'html';
    if (acceptsHtml) {
      const params = new URLSearchParams({
        success: 'true',
        name: inquiry.full_name,
        ref: inquiry.inquiry_id
      });
      return res.redirect(`/?${params.toString()}`);
    }

    return res.status(201).json(responsePayload);
  } catch (error) {
    console.error('Error saving inquiry or status history:', error);
    const acceptsHtml = req.accepts(['html', 'json']) === 'html';
    if (acceptsHtml) {
      return res.redirect('/?success=false');
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

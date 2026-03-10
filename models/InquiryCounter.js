const mongoose = require('mongoose');

const inquiryCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },   // sequence name
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('InquiryCounter', inquiryCounterSchema, 'inquiry_counters');

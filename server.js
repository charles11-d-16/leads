const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { submitInquiry } = require('./controllers/inquiryController');
const InquiryCounter = require('./models/InquiryCounter');

dotenv.config();

// Since you set MONGO_DB in Render, we'll use it directly for the database name.
const DB_NAME = process.env.MONGO_DB;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 0,
  })
  .then(async () => {
    console.log('MongoDB connected');
    console.log(`MongoDB host: ${mongoose.connection.host}`);

    try {
      await InquiryCounter.findOneAndUpdate(
        { _id: 'inquiry_id' },
        { $setOnInsert: { seq: 0 } },
        { upsert: true, new: true }
      );
      console.log('Inquiry counter initialized');
    } catch (error) {
      console.error('Error initializing inquiry counter:', error.message);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

app.post('/inquiry/submit', submitInquiry);
app.post('/api/inquiry', submitInquiry);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

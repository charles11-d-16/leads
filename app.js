const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const inquiryRoutes = require('./routes/inquiryRoutes');

require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('views'));




mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Connection error:', err));


app.use('/inquiry', inquiryRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
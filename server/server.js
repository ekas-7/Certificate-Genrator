const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

const certificateRouter = require('./routes/certificate-route');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure the path is correct for your routes
app.use('/api/getCertificate', certificateRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate-controller');

// Route to generate a certificate
router.get('/generate', certificateController.generateCertificateHandler);

module.exports = router;

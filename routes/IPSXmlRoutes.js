const express = require('express');
const router = express.Router();
const VerificationController = require('../controllers/XmlVerificationController');

// verification
router.post('/iso20022/incoming', VerificationController.IncomingTransaction);
router.post('/iso20022/test', VerificationController.testXml);


module.exports = router;

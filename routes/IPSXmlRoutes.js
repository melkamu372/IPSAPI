const express = require('express');
const router = express.Router();
const VerificationController = require('../controllers/XmlVerificationController');

// verification
router.get('/xmlverify/test', VerificationController.testAPI);
router.post('/verify/digest', VerificationController.VerificationInputDigest);
router.post('/verify/account', VerificationController.AccountVerification);
router.post('/verify/xml/account', VerificationController.xmlAccountVerification);
module.exports = router;

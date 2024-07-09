const express = require('express');
const router = express.Router();
const AccessController = require('../controllers/AccessController');
const VerificationController = require('../controllers/VerificationController');
const PushPaymentController = require('../controllers/pushPaymentController');

router.get('/access/test', AccessController.testAPI);
router.get('/access/get-recent-token', AccessController.getLastToken);
router.get('/access/generate-token', AccessController.GenerateAccesToken);
router.get('/access/refresh-token', AccessController.RefreshToken);
router.get('/access/is-expired', AccessController.isTokenExpired);
router.get('/access/get-access-token', AccessController.getAccessToken);
router.get('/access/get-json', AccessController.getjson);

// verification
router.get('/verify/test', VerificationController.testAPI);
router.post('/verify/digest', VerificationController.VerificationInputDigest);
router.post('/verify/account', VerificationController.AccountVerification);
router.post('/verify/xml/account', VerificationController.xmlAccountVerification);

// push Payment
router.get('/pushpayment/test', PushPaymentController.testAPI);
router.get('/pushpayment/input/xsdtest', PushPaymentController.PushPaymentInputTest);
router.post('/pushpayment/credit', PushPaymentController.Credit);
router.post('/pushpayment/xml/credit', PushPaymentController.xmlCredit);
module.exports = router;

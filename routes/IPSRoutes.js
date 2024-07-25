const express = require('express');
const router = express.Router();
const AccessRequest = require('../controllers/AccessController');
const VerificationRequest = require('../controllers/VerificationController');
const PushPaymentRequest = require('../controllers/pushPaymentController');
const PaymentStatusRequest = require('../controllers/PaymentStatusController');
const PaymentReturnRequest= require('../controllers/ReturnPaymentController');
const TransactionLog= require('../controllers/logController');
router.get('/access/test', AccessRequest.testAPI);
router.get('/access/get-recent-token', AccessRequest.getLastToken);
router.get('/access/generate-token', AccessRequest.GenerateAccesToken);
router.get('/access/refresh-token', AccessRequest.RefreshToken);
router.get('/access/is-expired', AccessRequest.isTokenExpired);
router.get('/access/get-access-token', AccessRequest.getAccessToken);
router.get('/access/get-json', AccessRequest.getjson);

// verification
router.get('/verify/test', VerificationRequest.testAPI);
router.post('/verify/digest', VerificationRequest.VerificationInputDigest);
router.post('/verify/account', VerificationRequest.AccountVerification);
router.post('/verify/xml/account', VerificationRequest.xmlAccountVerification);

// push Payment
router.get('/pushpayment/test', PushPaymentRequest.testAPI);
router.post('/pushpayment/input/xsdtest', PushPaymentRequest.PushPaymentInputTest);
router.post('/pushpayment/credit', PushPaymentRequest.Credit);
router.post('/pushpayment/xml/credit', PushPaymentRequest.xmlCredit);
// Push Payment Status Request
router.get('/paymentstatus/test', PaymentStatusRequest.testAPI);
router.post('/paymentstatus/xsdtest', PaymentStatusRequest.PushStatusInputTest);
router.post('/paymentstatus/request', PaymentStatusRequest.PaymentStatus);

// Return Payment
router.get('/paymentreturn/test', PaymentReturnRequest.testAPI);
router.post('/paymentreturn/xsdtest', PaymentReturnRequest.ReturnPaymentInputTest);
router.post('/paymentreturn/request', PaymentReturnRequest.ReturnPayment);

//log lists
router.get('/logs/transaction', TransactionLog.getTransaction_log);
router.get('/logs/transfer', TransactionLog.getTransfer_log);
router.post('/logs/register/transfer', TransactionLog.RegistrationTransfer_log);
router.post('/logs/register/incomming', TransactionLog.RegistrationTransaction_log);
module.exports = router;

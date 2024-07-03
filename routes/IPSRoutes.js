const express = require('express');
const router = express.Router();
const testAPIController = require('../controllers/TestController');
const AccessController = require('../controllers/AccessController');
const VerificationController = require('../controllers/VerificationController');
router.get('/access/test', testAPIController.testAPI);
router.get('/access/get-recent-token', AccessController.getLastToken);
router.get('/access/generate-token', AccessController.GenerateAccesToken);
router.get('/access/refresh-token', AccessController.RefreshToken);
router.get('/access/is-expired', AccessController.isTokenExpired);
router.get('/access/get-access-token', AccessController.getAccessToken);
router.get('/access/get-json', AccessController.getjson);

// verification
router.get('/verify/test', VerificationController.testAPI);
router.post('/verify/convert', VerificationController.convertAPI);
router.post('/verify/digest', VerificationController.digestAPI);
router.post('/verify/verify', VerificationController.Verification);

module.exports = router;

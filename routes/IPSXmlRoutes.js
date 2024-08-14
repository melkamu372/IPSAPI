const express = require('express');
const router = express.Router();
const IncommingController = require('../controllers/IncommingController');

// verification
router.post('/iso20022/incoming', IncommingController.IncomingTransaction);
router.post('/iso20022/test', IncommingController.testXml);


module.exports = router;

const logger = require('../logs/logger');
const js2xmlparser = require("js2xmlparser");


function sanitizeKey(key) {
  return key.replace(/[^a-zA-Z0-9_:]/g, "_");
}

function sanitizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  } else if (obj !== null && typeof obj === "object") {
    const sanitizedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitizedObj[sanitizeKey(key)] = sanitizeObject(obj[key]);
      }
    }
    return sanitizedObj;
  }
  return obj;
}

// Function to handle different ISO 20022 message types
exports.IncomingTransaction=async (req, res)=> {
  try {
    const document = req.body['fpenvelope'];
    const appHdr = document?.['header:apphdr'];
    const bizMsgIdr = appHdr?.['header:bizmsgidr'];
    const msgDefIdr = appHdr?.['header:msgdefidr'];
    if (!msgDefIdr|| !bizMsgIdr) {
      res.status(400).send('Message Definition Identifier (MsgDefIdr) not found');
      return;
    }

    switch (msgDefIdr) {
      case 'acmt.023.001.03':
        return handleAccountVerification(res, document);
      case 'pacs.008.001.10':
        return handlePushPayment(res, document);
      case 'pacs.028.001.05':
        return handlePaymentStatusRequest(res, document);
      case 'pacs.004.001.11':
        return handleReturn(res, document);
      default:
        res.set('Content-Type', 'application/xml');
        res.status(400).send('Unknown message type');
        return;
    }
  } catch (error) {
    logger.error(`Incoming request error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}

exports.testXml= async (req, res) =>{
  try {
    const document = req.body;
    const sanitizedData = sanitizeObject(document);
    const xmlString = js2xmlparser.parse("FPEnvelope", sanitizedData);
    res.set('Content-Type', 'application/xml');
    res.status(200).send(xmlString);
  } catch (error) {
    logger.error(`Error processing XML: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}

function handleAccountVerification(res,document) {
  console.log('Processing account verification');
  res.set('Content-Type', 'application/xml');
        res.status(400).send('Processing account verification');
        return;
}

function handlePushPayment(res,document) {
  console.log('Processing push payment');
     res.set('Content-Type', 'application/xml');
        res.status(400).send('Processing push payment');
        return;
}

function handlePaymentStatusRequest(res,document) {
  console.log('Processing payment status request');
  res.set('Content-Type', 'application/xml');
        res.status(400).send('Processing payment status request');
        return;
}

function handleReturn(res,document) {
  console.log('Processing return');
  res.set('Content-Type', 'application/xml');
        res.status(400).send('Processing return');
        return;
}



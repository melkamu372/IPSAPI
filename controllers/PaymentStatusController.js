const axios = require('axios');
const logger = require('../logs/logger');
const {xmlPushPaymentStatusResponseTojson}=require('../xmlToJson/xmlResponseConverter');
const {ips_payment_url}=require ('../utils/urls');
const {digestXml}=require("../services/digestXml");
const {generatePaymentStatusRequestXml} = require('../xmlFormator/requestXmlFormator');
const {getISO8601Date,getEastAfricanISO8601,generateBizMsgIdr,generateMsgId} = require('../utils/xmlIdGenerator');
const {getAccessToken}=require("../services/token-service");
const {XsdsValidation} =require("../xmlValidator/xmlValidator");
const path = require('path');

exports.testAPI = async (req, res) => {
  try {
    const testPlayload = {
      name:"Payment status request api test",
      connection:"test success "
    };
    logger.info('check push payment api ');
    res.status(200).json(testPlayload);
  } catch (error) {
    logger.error(`Error retrieving users: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.PushStatusInputTest = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Bad Request: your input is invalid' });
  }
    const xmlData=convertToXml(req.body);
    const XSD_PATH = path.resolve(__dirname, '../XSDs/paymentStatus_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData,XSD_PATH);
      if (!isValid) {
        return res.status(400).json({ error: 'XML payment status  request is not valid against XSD.' });    
      } 

      return res.status(200).json({ message: 'XML is valid against XSD.' });
  } catch (error) {
      logger.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to send XML data'+ error.message });
      }
  };
  
  exports.PaymentStatus = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Bad Request: your input is invalid' });
    } 
    
    const xmlData = convertToXml(req.body);
    const XSD_PATH = path.resolve(__dirname, '../XSDs/paymentStatus_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData, XSD_PATH);
      if (!isValid) {
        return res.status(400).json({ error: 'XML payment status request is not valid against XSD' });    
      } 
      
      const Signedxml = await digestXml(xmlData); 
      const isSignedxmlValid = await XsdsValidation(Signedxml, XSD_PATH);
      if (!isSignedxmlValid) {
        return res.status(400).json({ error: 'Signed payment request xml is not valid against XSD.' });    
      }
  
  
      const tokenResult = await getAccessToken();
      if (!tokenResult.status) {
        return res.status(400).json({ error: tokenResult.message });
      }         
      const accessToken = tokenResult.token;
      const headers = {
        'Content-Type': 'application/xml',
        'Connection': 'keep-alive',
        'Authorization': `Bearer ${accessToken}`
      };
      const response = await axios.post(ips_payment_url, Signedxml, { headers });
        //console.log(response.data);
        //res.set('Content-Type', 'application/xml');
        //res.status(200).send(response.data);
        //return;
      //xml to json converter  
      const jsondata = await xmlPushPaymentStatusResponseTojson(response.data);
      if (response.status == 200) {
        res.status(200).send(jsondata.data);
      } else {
        res.status(response.status).json({ error: response.statusText });
      }
  
    } catch (error) {
    
      // Check for network error
      if (error.code === 'ECONNABORTED' || error.message.includes('Network Error') || error.message.includes('timeout')) {
        res.status(503).json({ error: 'Service Unavailable: Network error' });
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(error.response.status).json({ error: error.response.data });
      } else if (error.request) {
        // The request was made but no response was received
        res.status(500).json({ error: 'Server did not respond' });
      } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).json({ error: error.message });
      }
    }
  };
  
exports.xmlPaymentStatusRequest = async (req, res) => {
 const xmlData=req.body;  
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Bad Request: your input is invalid' });
  }
  
 const XSD_PATH = path.resolve(__dirname, '../XSDs/payment_request.xsd');
  try {
    const isValid = await XsdsValidation(xmlData,XSD_PATH);
      if (!isValid) {
        return res.status(400).json({ error: 'XML is not valid against XSD.' });    
      } 
      
   const Signedxml= await digestXml(xmlData);
    
    const isSignedxmlValid = await XsdsValidation(Signedxml,XSD_PATH);
    
   
    
      if (!isSignedxmlValid) {
        return res.status(400).json({ error: 'Signed xml is not valid against XSD.' });    
      }
        
    const tokenResult = await getAccessToken();
     if(!tokenResult.status){
      res.status(400).json({ error: tokenResult.message });
         }         
    const accessToken = tokenResult.token;
    const headers = {
      'Content-Type': 'application/xml',
      'Connection': 'keep-alive',
      'Authorization': `Bearer ${accessToken}`
         };
    
    const response = await axios.post(ips_payment_url,Signedxml,{headers});  
   res.set('Content-Type', 'application/xml');
   res.status(200).send(response.data);
} catch (error) {
    //logger.error('Error: Failed to send XML data', error.message);   
    
    if (error.response) {
        res.status(error.response.status).json({ error: error.response.data});
        //console.error('Error headers:', error.response.headers);
    } else if (error.request) {
       res.status(400).json({ error: error.request});
        //console.error('Error request:', error.request);
    } else {
        res.status(400).json({ error:error.message});
       // console.error('Error message:', error.message);
      }
    }
};


// functions 
const convertToXml = (jsonInput) => {
  const BIC="ABAYETAA";
  const CreDtTm = getEastAfricanISO8601();
  const MsgId = generateMsgId();
  jsonInput.FromFinInstnId = BIC;
  jsonInput.ToFinInstnId = jsonInput.bankCode;
  jsonInput.BizMsgIdr = generateBizMsgIdr();
  jsonInput.CreDt = getISO8601Date();
  jsonInput.MsgDefIdr = "pacs.028.001.05";
  jsonInput.MsgId = MsgId;
  jsonInput.CreDtTm = CreDtTm;
  jsonInput. OrgnlTxId = jsonInput.transactionRef;
  const xmlDoc = generatePaymentStatusRequestXml(jsonInput);
  return xmlDoc;
};







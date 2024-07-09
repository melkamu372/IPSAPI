const axios = require('axios');
const logger = require('../logs/logger');
const {xmlVerificationResponseTojson}=require('../xmlToJson/xmlResponseConverter');
const {ips_payment_url}=require ('../utils/urls');
const {digestXml}=require("../services/digestXml");
const {generatePaymentRequestXml} = require('../xmlFormator/requestXmlFormator');
const { getISO8601Date,getEastAfricanISO8601,generateBizMsgIdr,generateMsgId} = require('../utils/xmlIdGenerator');
const {getAccessToken}=require("../services/token-service");
const {XsdsValidation} =require("../xmlValidator/xmlValidator");
const path = require('path');

exports.testAPI = async (req, res) => {
  try {
    const testPlayload = {
      name:"Push Payment api test",
      connection:"test success "
    };
    logger.info('check push payment api ');
    res.status(200).json(testPlayload);
  } catch (error) {
    logger.error(`Error retrieving users: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.PushPaymentInputTest = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Bad Request: your input is invalid' });
  }
    const xmlData=convertToXml(req.body);
    // res.set('Content-Type', 'application/xml');
    // res.status(200).send(xmlData);
    // return;
    const XSD_PATH = path.resolve(__dirname, '../XSDs/payment_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData,XSD_PATH);
      if (!isValid) {
        return res.status(400).json({ error: 'XML payment request is not valid against XSD.' });    
      } 

      return res.status(200).json({ message: 'XML is valid against XSD.' });
  } catch (error) {
      logger.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to send XML data'+ error.message });
      }
  };
  
exports.Credit= async (req, res) => {
  const xmlData=convertToXml(req.body); 
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Bad Request: your input is invalid' });
  } 
  const XSD_PATH = path.resolve(__dirname, '../XSDs/payment_request.xsd');
  try {
    const isValid = await XsdsValidation(xmlData,XSD_PATH);
      if (!isValid) {
        return res.status(400).json({ error: 'XML payment request is not valid against XSD' });    
      } 
      
   const Signedxml= await digestXml(xmlData); 
    const isSignedxmlValid = await XsdsValidation(Signedxml,XSD_PATH);
    
      if (!isSignedxmlValid) {
        return res.status(400).json({ error: 'Signed payment request xml is not valid against XSD.' });    
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
      
      //xml to json converter  
     const jsondata = await xmlVerificationResponseTojson(response.data); 
     // console.log(jsondata);
    if(response.status==200){
    res.status(200).send(jsondata);
    }
    else{
    res.status(response.status).json({ error:response.statusText});
    }
    
   // res.set('Content-Type', 'application/xml');
    //res.status(200).send({ message: 'XML data sent successfully', response: response.data });
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

exports.xmlCredit = async (req, res) => {

 const xmlData=req.body.data; 
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
      'Content-Length': '1625', // Content-Length should be a string
      'Connection': 'keep-alive',
      'Authorization': `Bearer ${accessToken}`
         };
    
    const response = await axios.post(ips_payment_url,Signedxml,{headers});  
   res.set('Content-Type', 'application/xml');
   res.status(200).send({ message: 'XML data sent successfully', response: response.data });
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
  const CreDtTm = getEastAfricanISO8601();
  const MsgId = generateMsgId();
  // Populate JSON input with required fields
  jsonInput.FromFinInstnId = "ABAYETAA";
  jsonInput.ToFinInstnId = "ETSETAA";
  jsonInput.BizMsgIdr = generateBizMsgIdr();
  jsonInput.CreDt = getISO8601Date();
  jsonInput.MsgDefIdr = "pacs.008.001.10";
  jsonInput.MsgId = MsgId;
  jsonInput.CreDtTm = CreDtTm;
  jsonInput.NbOfTxs = 1;
  jsonInput.SttlmMtd = "CLRG";
  jsonInput.ClrSysPrtry = "FP";
  jsonInput.PmtTpInfPrtry = "CRTRM";//INTR P2P
  jsonInput.EndToEndId = MsgId;
  jsonInput.AccptncDtTm = CreDtTm;
  jsonInput.ChrgBr = "SLEV";
  jsonInput.CcyFrom='ETB';
  jsonInput.CcyTo='ETB';
  jsonInput.DbtrNm = jsonInput.name; // Assuming name is provided in jsonInput
  jsonInput.AdrLine = jsonInput.address; // Assuming address is provided in jsonInput
  jsonInput.DbtrAcctId = jsonInput.accountNumber; // Assuming accountNumber is provided in jsonInput
  jsonInput.DbtrAcctIssr = 'ATM';// USSD,Mobile Banking 
  jsonInput.DbtrAcctPrtry = "ACCT"; //CHK,SAV,ACCT
  jsonInput.DbtrAgtId = "DBTRAGT123";// AbayBank Debiter ID
  jsonInput.DbtrAgtIssr = 'C'; // Assuming bankCode is provided in jsonInput
  jsonInput.CdtrAgtId = jsonInput.bankCode; // Assuming bankCode is provided in jsonInput
  jsonInput.CdtrNm = jsonInput.name; // Assuming name is provided in jsonInput
  jsonInput.CdtrAcctId = jsonInput.accountNumber; // Assuming accountNumber is provided in jsonInput
  jsonInput.CdtrAcctPrtry = "ACCT"; // ACCT SAV
  jsonInput.RmtInfUstrd = "Transferring my funds";
  const xmlDoc = generatePaymentRequestXml(jsonInput);
  return xmlDoc;
};







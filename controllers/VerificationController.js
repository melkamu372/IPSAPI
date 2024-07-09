const axios = require('axios');
const logger = require('../logs/logger');

const {xmlVerificationResponseTojson}=require('../xmlToJson/xmlResponseConverter');
const {ips_payment_url}=require ('../utils/urls');
const { generateVerifcationRequestXml} = require('../xmlFormator/requestXmlFormator');
const { getISO8601Date,getEastAfricanISO8601,generateBizMsgIdr,generateMsgId} = require('../utils/xmlIdGenerator');
const {getAccessToken}=require("../services/token-service");
const {XsdsValidation} =require("../xmlValidator/xmlValidator");
const {digestXml}=require("../services/digestXml");
const path = require('path');

exports.testAPI = async (req, res) => {
  try {
    const testPlayload = {
      name:"verification test api works",
      connection:"test success "
    };
    logger.info('check verfication');
    res.status(200).json(testPlayload);
  } catch (error) {
    logger.error(`Error retrieving users: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.AccountVerification= async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Bad Request: your input is invalid' });
  }  
  const xmlData=convertToxml(req.body);  
    const XSD_PATH = path.resolve(__dirname, '../XSDs/verification_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData,XSD_PATH);
        if (!isValid) {
          return res.status(400).json({ error: 'XML is not valid against XSD.' });    
        } 
      
    const Signedxml= await digestXml(xmlData); 

    if(!Signedxml){
      return res.status(400).json({ error: 'sign xml is not work properly check your connection.' });
        }
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
    const jsondata = await xmlVerificationResponseTojson(response.data); 
    console.log(jsondata);
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

exports.xmlAccountVerification = async (req, res) => {

 const xmlData=req.body.data; 
  const XSD_PATH = path.resolve(__dirname, '../XSDs/verification_request.xsd');
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

exports.VerificationInputDigest= async (req, res) => {
  const xmlData=convertToxml(req.body);  
  const XSD_PATH = path.resolve(__dirname, '../XSDs/verification_request.xsd');
  try {
    const isValid = await XsdsValidation(xmlData,XSD_PATH);
      if (!isValid) {
        return res.status(400).json({ error: 'XML is not valid against XSD.' });    
      } 
    
  const Signedxml= await digestXml(xmlData);  
  
  if(!Signedxml){
    return res.status(400).json({ error: 'sign  xml is not work properly check your connection.' });
      }

  const isSignedxmlValid = await XsdsValidation(Signedxml,XSD_PATH);
    if (!isSignedxmlValid) {
      return res.status(400).json({ error: 'Signed xml is not valid against XSD.' });    
    } 
  res.set('Content-Type', 'application/xml');
  res.status(200).send({ message: 'XML data sent successfully', response: response.data });
} catch (error) {   
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
function convertToxml(jsonInput) {
   const FromFinInstnId="ABAYETAA";
    const ToFinInstnId="ETSETAA";
    const BizMsgIdr= generateBizMsgIdr();
    const CreDt=getISO8601Date();
    const MsgDefIdr="acmt.023.001.03";
    const CreDtTm=getEastAfricanISO8601();
    const VrfctnId=generateMsgId();
    // Headers
    jsonInput. FromFinInstnId=FromFinInstnId;
    jsonInput.ToFinInstnId=ToFinInstnId;
    jsonInput.CreDt=CreDt;
    jsonInput.BizMsgIdr=BizMsgIdr;
    //body 
    jsonInput.MsgId=MsgDefIdr;
    jsonInput. MsgDefIdr=MsgDefIdr;
    jsonInput.CreDtTm=CreDtTm;
    jsonInput.VrfctnId=VrfctnId;
    // Capture the JSON input from the request body
    const xmlDoc = generateVerifcationRequestXml(jsonInput); 
    return xmlDoc;
};






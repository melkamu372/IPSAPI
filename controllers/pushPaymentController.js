const axios = require('axios');
const logger = require('../logs/logger');

const {xmlVerificationResponseTojson}=require('../xmlToJson/xmlResponseConverter');
const {verification_url,digest_url}=require ('../utils/urls');
const { generateVerifcationRequestXml} = require('../xmlFormator/verifcationXmlFormator');
const { getCurrentDateInISO8601,getCurrentDateINEastAfricanISO8601} = require('../utils/IsoDateUtils');
const { generateBizMsgIdr,GenerateVerificationMsgId } = require('../utils/MsgIdUtils');
const {getAccessToken}=require("../services/token-service");
const {XsdsValidation} =require("../xmlValidator/xmlValidator");
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

exports.VerificationTest = async (req, res) => {
   const xmlData=convertToxml(req.body);
    const XSD_PATH = path.resolve(__dirname, '../XSDs/verification_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData,XSD_PATH);
      if (!isValid) {
        return res.status(400).json({ error: 'XML is not valid against XSD.' });    
      } 
      return res.status(200).json({ message: 'XML is valid against XSD.' });
  } catch (error) {
      logger.error('Error:', error.message);
     res.status(500).json({ error: 'Failed to send XML data'+ error.message });
      }
  };
  
exports.AccountVerification= async (req, res) => {
  const xmlData=convertToxml(req.body);  
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
      'Connection': 'keep-alive',
      'Authorization': `Bearer ${accessToken}`
         };
         
    const response = await axios.post(verification_url,Signedxml,{headers}); 
      
      //xml to json converter  
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
    
    const response = await axios.post(verification_url,Signedxml,{headers});  
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


// Verification controller
exports.convertAPI = async (req, res) => {
  try {
    const xmlDoc=convertToxml(req.body);
    //const xmlDoc = generateVerifcationRequestXmljsonInput);    
    logger.info('Converted JSON to XML');
    res.set('Content-Type', 'application/xml');
    res.status(200).send(xmlDoc);
  } catch (error) {
    logger.error(`Error converting JSON to XML: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// fakedigestapi
exports.digestAPI = async (req, res) => {
  try {
    const xmlDoc=convertToxml(req.body);
   // const xmlData= digestXml(xmlDoc);
    res.set('Content-Type', 'application/xml');
   // res.status(200).send(xmlData);
   res.status(200).send(xmlDoc);
  } catch (error) {
    logger.error(`Error converting JSON to XML: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// functions 
function convertToxml(jsonInput) {
   const FromFinInstnId="ABAYETAA";
    const ToFinInstnId="ETSETAA";
    const BizMsgIdr= generateBizMsgIdr();
    const CreDt=getCurrentDateInISO8601();
    const MsgDefIdr="acmt.023.001.03";
    const CreDtTm=getCurrentDateINEastAfricanISO8601();
    const VrfctnId=GenerateVerificationMsgId();
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

async function digestXml(xmlData) {
  try {
    const response = await axios.post(digest_url, xmlData, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error digesting XML:', error);
    throw error;
  }
}




const axios = require('axios');
const logger = require('../logs/logger');
const xml2js = require('xml2js');

const {verification_url,digest_url}=require ('../utils/urls');
const { generateXmlDocument } = require('../utils/xmlRequestUtils');
const { getCurrentDateInISO8601,getCurrentDateINEastAfricanISO8601} = require('../utils/IsoDateUtils');
const { generateBizMsgIdr,GenerateVerificationMsgId } = require('../utils/MsgIdUtils');
const {getAccessToken}=require("../services/token-service");
const {XsdsValidation} =require("../xmlValidator/xmlValidator");
const path = require('path');
// Construct the absolute path using __dirname
//verification controller 
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
     const jsondata = await xmltojson(response.data); 
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
    //const xmlDoc = generateXmlDocument(jsonInput);    
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
    const xmlDoc = generateXmlDocument(jsonInput); 
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




async function xmltojson(xmlResponse) {
  try {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlResponse, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
          reject({
            status: false,
            message: 'Error parsing XML',
            data: err
          });
        } else {
          const msgDefIdr = result['FPEnvelope']['header:AppHdr'][0]['header:MsgDefIdr'][0];
          const frId = result['FPEnvelope']['header:AppHdr'][0]['header:Fr'][0]['header:FIId'][0]['header:FinInstnId'][0]['header:Othr'][0]['header:Id'][0];
          const toId = result['FPEnvelope']['header:AppHdr'][0]['header:To'][0]['header:FIId'][0]['header:FinInstnId'][0]['header:Othr'][0]['header:Id'][0];
          const bizMsgIdr = result['FPEnvelope']['header:AppHdr'][0]['header:BizMsgIdr'][0];
          const creDt = result['FPEnvelope']['header:AppHdr'][0]['header:CreDt'][0];
  
          const rltdFrId = result['FPEnvelope']['header:AppHdr'][0]['header:Rltd'][0]['header:Fr'][0]['header:FIId'][0]['header:FinInstnId'][0]['header:Othr'][0]['header:Id'][0];
          const rltdToId = result['FPEnvelope']['header:AppHdr'][0]['header:Rltd'][0]['header:To'][0]['header:FIId'][0]['header:FinInstnId'][0]['header:Othr'][0]['header:Id'][0];
          const rltdBizMsgIdr = result['FPEnvelope']['header:AppHdr'][0]['header:Rltd'][0]['header:BizMsgIdr'][0];
          const rltdMsgDefIdr = result['FPEnvelope']['header:AppHdr'][0]['header:Rltd'][0]['header:MsgDefIdr'][0];
          const rltdCreDt = result['FPEnvelope']['header:AppHdr'][0]['header:Rltd'][0]['header:CreDt'][0];
  
          const assgnmtMsgId = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Assgnmt'][0]['document:MsgId'][0];
          const assgnmtCreDtTm = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Assgnmt'][0]['document:CreDtTm'][0];
          const assgnmtAssgnrId = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Assgnmt'][0]['document:Assgnr'][0]['document:Agt'][0]['document:FinInstnId'][0]['document:Othr'][0]['document:Id'][0];
          const assgnmtAssgneId = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Assgnmt'][0]['document:Assgne'][0]['document:Agt'][0]['document:FinInstnId'][0]['document:Othr'][0]['document:Id'][0];
  
          const orgnlAssgnmtMsgId = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:OrgnlAssgnmt'][0]['document:MsgId'][0];
          const orgnlAssgnmtCreDtTm = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:OrgnlAssgnmt'][0]['document:CreDtTm'][0];
  
          const rptOrgnlId = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Rpt'][0]['document:OrgnlId'][0];
          const rptVrfctn = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Rpt'][0]['document:Vrfctn'][0];
          const rptRsn = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Rpt'][0]['document:Rsn'][0]['document:Prtry'][0];
  
          const data = {
            MsgDefIdr: msgDefIdr,
            Fr_Id: frId,
            To_Id: toId,
            BizMsgIdr: bizMsgIdr,
            CreDt: creDt,
            Rltd_Fr_Id: rltdFrId,
            Rltd_To_Id: rltdToId,
            Rltd_BizMsgIdr: rltdBizMsgIdr,
            Rltd_MsgDefIdr: rltdMsgDefIdr,
            Rltd_CreDt: rltdCreDt,
            Assgnmt_MsgId: assgnmtMsgId,
            Assgnmt_CreDtTm: assgnmtCreDtTm,
            Assgnmt_Assgnr_Id: assgnmtAssgnrId,
            Assgnmt_Assgne_Id: assgnmtAssgneId,
            OrgnlAssgnmt_MsgId: orgnlAssgnmtMsgId,
            OrgnlAssgnmt_CreDtTm: orgnlAssgnmtCreDtTm,
            Rpt_OrgnlId: rptOrgnlId,
            Rpt_Vrfctn: rptVrfctn,
            Rpt_Rsn: rptRsn
          };
  
          resolve({
            status: true,
            message: 'The xml response converted as expected',
            data: data
          });
        }
      });
    });
  } catch (error) {
    console.error('Error converting xml response to json:', error);
    return {
      status: false,
      message: 'Error converting xml response to json',
      data: error
    };
  }
}


const axios = require('axios');
const logger = require('../logs/logger');
const {RegisterTransactionLog,RegisterTransferLog,UpdateTransferLogs}=require("../services/log-service");
const {getAccountUser} =require("../services/push-payment-service.js");
const {xmlSignedPushRequestToJson,xmlPushPaymentResponseTojson}=require('../xmlToJson/xmlResponseConverter');
const {ips_payment_url}=require ('../utils/urls');
const {digestXml}=require("../services/digestXml");
const {generatePaymentRequestXml} = require('../xmlFormator/requestXmlFormator');
const {getISO8601Date,getEastAfricanISO8601,generateBizMsgIdr,generateMsgId} = require('../utils/xmlIdGenerator');
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


  
 exports.Credit = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({"status":"Failed", "message": 'Bad request your input is invalid'});
    }
  const inputData = {
      amount: req.body.amount,
      bank: req.body.bankCode,
      transaction_code: req.body.transactionRef,
      creditor_account: req.body.accountNumber,
      status: "Start"
    };
     const trans_log= await RegisterTransferLog(inputData);
      if (!trans_log) {
      return res.status(400).json({"status":"Failed", "message": 'Bad request unable to registration log' });
    }
    
    inputData.id=trans_log.log.dataValues.id;    
   const accountifo= await getAccountUser({"account_number":req.body.accountNumber,"bank":req.body.bankCode}) ;
   
   if(accountifo.status!="SUCCESS"){
   return res.status(400).json({"status":"Failed", "message": 'Creditor account does not exist' });
   }
   
     inputData.CdtrNm=accountifo.beneficiaryName;
   const xmlData = convertToXml(inputData);
   const XSD_PATH = path.resolve(__dirname, '../XSDs/payment_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData, XSD_PATH);
      if (!isValid) {
        return res.status(400).json({"status":"Failed", "message": 'XML payment request is not valid against XSD' });    
      } 
  
   const Signedxml = await digestXml(xmlData); 
   const isSignedxmlValid = await XsdsValidation(Signedxml, XSD_PATH);
      if (!isSignedxmlValid) {
        return res.status(400).json({"status":"Failed", "message": 'Signed payment request xml is not valid against XSD' });    
      }
  
   const tokenResult = await getAccessToken();
      if (!tokenResult.status) {
        return res.status(400).json({ error: tokenResult.message });
      }         
   const Signedjsondata = await xmlSignedPushRequestToJson(Signedxml);
         Signedjsondata.data.status="Request";
         Signedjsondata.data.id=inputData.id;
         await UpdateTransferLogs(Signedjsondata.data);
   const accessToken = tokenResult.token;
   const headers = {
        'Content-Type': 'application/xml',
        'Connection': 'keep-alive',
        'Authorization': `Bearer ${accessToken}`
      };
   const response = await axios.post(ips_payment_url,Signedxml,{headers});
        // console.log(response);
        //res.set('Content-Type', 'application/xml');
        //res.status(200).send(response.data);
        //return;
        //xml to json converter    
   const jsondata = await xmlPushPaymentResponseTojson(response.data);
   const transferResult=jsondata.data;
   const newUpdateBody={
      id:inputData.id,
      eth_ref: transferResult.transactionRef,
      status: transferResult.status ? "SUCCESS" : "Failed"};
      await UpdateTransferLogs(newUpdateBody); 
      if (response.status == 200) {
   const rsponseData=
        {
     "status": transferResult.status,
     "message": transferResult.message,
     "transactionRef": transferResult.transactionRef,
       }
        res.status(200).send(rsponseData);
      } else {
        res.status(response.status).json({ error: response.statusText });
      }
  
    } catch (error) {
      const failerTransaction={
      id:inputData.id,
      status:"Failed"
      };
      await UpdateTransferLogs(failerTransaction);
      // Check for network error
      if (error.code === 'ECONNABORTED' || error.message.includes('Network Error') || error.message.includes('timeout')) {
        res.status(503).json( {"status":"Failed", "message": "Service Unavailable: Network error" });
      } else if (error.response) {
        const data= {
          status: "Failed",
          message: error.response.statusText,
          };
        res.status(error.response.status).json(data);
      } else if (error.request) {
        // The request was made but no response was received
         res.status(500).json( {"status":"Failed", "message": "Server did not respond" });
      } else {
        // Something happened in setting up the request that triggered an Error
         res.status(500).json( {"status":"Failed", "message":error.message });
      }
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

 exports.xmlCredit = async (req, res) => {
 const xmlData=req.body;  
 console.log(req.body);
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
  const DbtrNm="Abay Bank account number";
  const DbtrAcct="10210156789";
  const BIC="ABAYETAA";
  const Cdtrbank =jsonInput.bank;
  const CdtrNm=jsonInput.CdtrNm;
  const CdtrAcc= jsonInput.creditor_account;
  const CreDtTm = getEastAfricanISO8601();
  const MsgId = generateMsgId();
  jsonInput.FromFinInstnId = BIC;
  jsonInput.ToFinInstnId = Cdtrbank;
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
  jsonInput.DbtrNm = DbtrNm; 
  jsonInput.AdrLine = "Addis Ababa,Ethiopia"; 
  jsonInput.DbtrAcctId =DbtrAcct; 
  jsonInput.DbtrAcctIssr = 'ATM';
  jsonInput.DbtrAcctPrtry = "ACCT"; 
  jsonInput.DbtrAgtId = BIC;
  jsonInput.DbtrAgtIssr = 'C';
  jsonInput.CdtrAgtId = Cdtrbank; 
  jsonInput.CdtrNm = CdtrNm; 
  jsonInput.CdtrAcctId =CdtrAcc;    
  jsonInput.CdtrAcctPrtry = "ACCT";
  jsonInput.RmtInfUstrd = "Transferring my funds";
  const xmlDoc = generatePaymentRequestXml(jsonInput);
  return xmlDoc;
};







const axios = require('axios');
const {xmlVerificationResponseTojson,xmlPushPaymentStatusResponseTojson}=require('../xmlToJson/xmlResponseConverter');
const {ips_payment_url}=require ('../utils/urls.js');
const {digestXml}=require("./digestXml.js");
const {generateVerifcationRequestXml,generatePaymentStatusRequestXml} = require('../xmlFormator/requestXmlFormator');
const {getISO8601Date,getEastAfricanISO8601,generateBizMsgIdr,generateMsgId} = require('../utils/xmlIdGenerator');
const {getAccessToken}=require("./token-service.js");
const {XsdsValidation} =require("../xmlValidator/xmlValidator");
const path = require('path');



exports.getAccountUser= async (RequestBody) => {
  if (!RequestBody || Object.keys(RequestBody).length === 0) {
    return {"status": "ERROR", "message": "Bad Request: your input is invalid"};
  }  
  const xmlData=convertVerificationToxml(RequestBody);  
    const XSD_PATH = path.resolve(__dirname, '../XSDs/verification_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData,XSD_PATH);
        if (!isValid) {
          return {"status": "ERROR", "message": "XML is not valid against XSD"};   
        } 
      
    const Signedxml= await digestXml(xmlData); 
    if(!Signedxml){
      return {"status": "ERROR", "message": "sign xml is not work properly check your connection"};
        }
    const isSignedxmlValid = await XsdsValidation(Signedxml,XSD_PATH);
      if (!isSignedxmlValid) {
        return {"status": "ERROR", "message": "Signed xml is not valid against XSD"};    
      }
       
    const tokenResult = await getAccessToken();
     if(!tokenResult.status){
      return {"status": "ERROR", "message": "invalid token"};
         }         
    const accessToken = tokenResult.token;
    const headers = {
      'Content-Type': 'application/xml',
      'Connection': 'keep-alive',
      'Authorization': `Bearer ${accessToken}`
         };

    const response = await axios.post(ips_payment_url,Signedxml,{headers});   
    const jsondata = await xmlVerificationResponseTojson(response.data); 
    
    if(response.status==200){
       return jsondata.data;
    }
    else{
      return {"status": "ERROR", "message": "Unable to get response from server"};
    }  
} catch (error) {  
console.log(error);
  return {"status": "ERROR", "message": "internal server error"};
}
}


exports.getPaymentStatus = async (paymentBody) => {
    if (!paymentBody || Object.keys(paymentBody).length === 0) {
      return {"status": "ERROR", "message": "Bad Request"};
    } 
    const xmlData = convertToXml(paymentBody);
    const XSD_PATH = path.resolve(__dirname, '../XSDs/paymentStatus_request.xsd');
    try {
      const isValid = await XsdsValidation(xmlData, XSD_PATH);
    if (!isValid) {
        return {"status": "ERROR", "message": "invalid Request"};     
      } 
      const Signedxml = await digestXml(xmlData); 
      const isSignedxmlValid = await XsdsValidation(Signedxml, XSD_PATH);
    if (!isSignedxmlValid) {
        return {"status": "ERROR", "message": "invalid signed xml "};    
      }
      const tokenResult = await getAccessToken();
    if (!tokenResult.status) {
        return {"status": "ERROR", "message": "invalid token"};
      }         
      const accessToken = tokenResult.token;
      const headers = {
        'Content-Type': 'application/xml',
        'Connection': 'keep-alive',
        'Authorization': `Bearer ${accessToken}`
      };
    const response = await axios.post(ips_payment_url, Signedxml, { headers });  
    if (response.status == 200) {
        const jsondata = await xmlPushPaymentStatusResponseTojson(response.data);
        return jsondata.data;
      } 
    else {
        return {"status": "ERROR", "message": "ERROR From Server"};
      }
    }
    catch (error) {
        return {"status": "ERROR", "message": "Internal server error"};
      }
  };



  function convertVerificationToxml(jsonInput) {
    const FromFinInstnId="ABAYETAA";
    const ToFinInstnId=jsonInput.bank;
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
  
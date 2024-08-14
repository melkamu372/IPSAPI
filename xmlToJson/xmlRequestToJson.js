const xml2js = require('xml2js');


const { generateVerificationXmlResponse} = require('../xmlFormator/responseToXml');
async function IncommingXmlAccountVerification(document) {
 
const accountNumber = document['fpenvelope']['document:document']['document:idvrfctnreq']['document:vrfctn']['document:ptyandacctid']['document:acct']['document:id']['document:othr']['document:id'];
   //const institutionId = document['fpenvelope']['document:document']['document:idvrfctnreq']['document:agt']['document:fininstnid']['document:othr']['document:id'];
const prtry = document['fpenvelope']['document:document']['document:idvrfctnreq']['document:vrfctn']['document:ptyandacctid']['document:acct']['document:id']['document:othr']['document:schmenm']['document:prtry'];

const data={accountNumber,bank:prtry }

const cat = convertToxml(data);
return cat;
  }

function convertToxml(jsonInput) {
    // Test data with all required fields
    const testData = {
    hdrOrginatorFIBic: "ABAYETAA20240812131850049",
    hdrDestinationFIBic: "XYZBANKAA",
    "hdrBizMsgId": "ABAYETAA20240814112233445",
    "hdrMsgCreatedDateZoned": "2024-08-14T11:27:42.499Z",
    "ltdOrginatorFIBic": "ABAYETAA20240812131850049",
    "ltdDestinationFIBic": "XYZBANKAA",
    "ltdBizMsgId": "ABAYETAA20240814112233445",
    "ltdMsgCreatedDateZoned": "2024-08-14T11:27:42.499Z",
    "bdyMgId": "MSGID1234567890",
    "bdyMsgCreatedDateZoned": "2024-08-14T08:30:00Z",
    "bdyOrginatorFIBic": "ABAYETAA20240812131850049",
    "bdyDestinationFIBic": "XYZBANKAA",
    "orginalMsgId": "ORGMSGID0987654321",
    "orgMsgCreatedDateZoned": "2024-08-14T07:00:00Z",
    "orginalTransactionId": "TXN1234567890",
    "isSuccess": "true",
    "statusMessage": "Verification successful",
    "accountToBeVerified": "987654321",
    "accountTypeToBeVerified": "Current",
    "verifiedAccountHolderName": "John Doe",
    "accountVerified": "987654321",
    "accountTypeVerified": "Current"
       }
    // Generate the XML response
    const xmlDoc = generateVerificationXmlResponse(testData);
    return xmlDoc;
}


  module.exports = {IncommingXmlAccountVerification};
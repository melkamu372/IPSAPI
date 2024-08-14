const xml2js = require('xml2js');

async function xmlVerificationResponseTojson(xmlResponse) {
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
           let name="";
           let status="FAILED";
           let message="Invalid Account";
        if(rptVrfctn=='true'){
          status="SUCCESS";
          name = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Rpt'][0]['document:UpdtdPtyAndAcctId'][0]['document:Pty'][0]['document:Nm'][0];
          message = result['FPEnvelope']['document:Document'][0]['document:IdVrfctnRpt'][0]['document:Rpt'][0]['document:UpdtdPtyAndAcctId'][0]['document:Acct'][0]['document:Id'][0]['document:Othr'][0]['document:Id'][0];
           
                } 
           else {
           
           if(rptRsn=="WBIC"){
           message="Financial Institution does not registered in a Bank Identifier Code (BIC)";
           
           }
               
           }        
                 
            const data = {
              status: status,
              message:message,
              beneficiaryName: name
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
      //console.error('Error converting xml response to json:', error);
      return {
        status: false,
        message: 'Error converting xml response to json',
        data: error
      };
    }
  }

async function xmlPushPaymentResponseTojson(xmlResponse) {
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
                   
          const TransactionStatus =  result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:TxSts'][0];
          const orgnlTxId = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxId'][0]; 
          const amount = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Amt'][0]['document:InstdAmt'][0]['_'];
          const currency = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Amt'][0]['document:InstdAmt'][0]['$']['Ccy'];
          const debitor = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Dbtr'][0]['document:Pty'][0]['document:Nm'][0];
          const creditor = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Cdtr'][0]['document:Pty'][0]['document:Nm'][0];
          const debitorAccount = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:DbtrAcct'][0]['document:Id'][0]['document:Othr'][0]['document:Id'][0];
          const creditorAccount = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:CdtrAcct'][0]['document:Id'][0]['document:Othr'][0]['document:Id'][0];
         const reciverBank = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:GrpHdr'][0]['document:InstdAgt'][0]['document:FinInstnId'][0]['document:Othr'][0]['document:Id'][0];

          
          let status="FAILED";
           let message="transaction rejected"; 
           
           if(TransactionStatus=="ACSC"){
              status="SUCCESS";
              message="transaction is successfully completed";
           }

            const data = {
              status: status,
              message:message,
              transactionRef:orgnlTxId,
              amount,
              debitor,
              creditor,
              debitorAccount,
              creditorAccount,
              bank:reciverBank
              
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
      //console.error('Error converting xml response to json:', error);
      return {
        status: false,
        message: 'Error converting xml response to json',
        data: error
      };
    }
  }

  async function xmlPushPaymentStatusResponseTojson(xmlResponse) {
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
          try {
          
          // console.log(JSON.stringify(result, null, 2));
          
            const transactionStatus = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:TxSts'][0];
           
            let status = "FAILED";
            let orgnlTxId="";
            let message = "transaction rejected";
            let amount=0;
            let creditorAccount="";  
            let reciverBank="";    
            if (transactionStatus === "ACSC") {
            orgnlTxId = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxId'][0];
            amount = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Amt'][0]['document:InstdAmt'][0]['_'];
            reciverBank = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:GrpHdr'][0]['document:InstdAgt'][0]['document:FinInstnId'][0]['document:Othr'][0]['document:Id'][0];
            const currency = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Amt'][0]['document:InstdAmt'][0]['$']['Ccy'];
            const debitor = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Dbtr'][0]['document:Pty'][0]['document:Nm'][0];
            // const creditor = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:Cdtr'][0]['document:Pty'][0]['document:Nm'][0];
            
            const debitorAccount = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:DbtrAcct'][0]['document:Id'][0]['document:Othr'][0]['document:Id'][0];
            creditorAccount = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxRef'][0]['document:CdtrAcct'][0]['document:Id'][0]['document:Othr'][0]['document:Id'][0];
            
              status = "SUCCESS";
              message = "transaction is successfully completed";
             }

           else{
     message = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:StsRsnInf'][0]['document:AddtlInf'][0];
     status=transactionStatus;
           }

            const data = {
              status: status,
              message: message,
              transactionRef: orgnlTxId,
              amount,
              creditorAccount,
              bank: reciverBank
            };

            resolve({
              status: true,
              message: 'The xml response converted as expected',
              data: data
            });
          } catch (parseError) {
            reject({
              status: false,
              message: 'Error extracting data from XML',
              data: parseError
            });
          }
        }
      });
    });
  } catch (error) {
    return {
      status: false,
      message: 'Error converting xml response to json',
      data: error
    };
  }
}

  
  async function xmlReturnPaymentResponseToJson(xmlResponse) {
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
            const TransactionStatus = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:TxSts'][0];
            const orgnlTxId = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:OrgnlTxId'][0];
            const StsRsnInf = result['FPEnvelope']['document:Document'][0]['document:FIToFIPmtStsRpt'][0]['document:TxInfAndSts'][0]['document:StsRsnInf'][0]['document:AddtlInf'][0];
  
            let status = "FAILED";
            let message = "Transaction rejected";
  
            if (TransactionStatus === "ACSC") {
              status = "SUCCESS";
              message = "Transaction is successfully completed";
            } else if (TransactionStatus === "RJCT") {
              status = "FAILED";
              message = StsRsnInf || "Transaction rejected";
            }
  
            const data = {
              status: status,
              message: message,
              transactionRef: orgnlTxId
            };
  
            resolve({
              status: true,
              message: 'The XML response was converted as expected',
              data: data
            });
          }
        });
      });
    } catch (error) {
      return {
        status: false,
        message: 'Error converting XML response to JSON',
        data: error
      };
    }
  }
  
  
 async function xmlSignedPushRequestToJson(SignedxmlPushRequest) {
    try {
        return new Promise((resolve, reject) => {
            xml2js.parseString(SignedxmlPushRequest, { tagNameProcessors: [xml2js.processors.stripPrefix] }, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                    reject({
                        status: false,
                        message: 'Error parsing XML',
                        data: err
                    });
                } else {
                    try {
                        // Extracting SignedXml
                        const signedXml = result.FPEnvelope.AppHdr[0].Sgntr[0];

                        // Extracting necessary fields
                        const orgnlTxId = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].CdtTrfTxInf[0].PmtId[0].TxId[0];
                        const amount = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].CdtTrfTxInf[0].InstdAmt[0]._;
                        const currency = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].CdtTrfTxInf[0].InstdAmt[0].$.Ccy;
                        const debitor = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].CdtTrfTxInf[0].Dbtr[0].Nm[0];
                        const creditor = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].CdtTrfTxInf[0].Cdtr[0].Nm[0];
                        const debitorAccount = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].CdtTrfTxInf[0].DbtrAcct[0].Id[0].Othr[0].Id[0];
                        const creditorAccount = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].CdtTrfTxInf[0].CdtrAcct[0].Id[0].Othr[0].Id[0];
                        const receiverBank = result.FPEnvelope.Document[0].FIToFICstmrCdtTrf[0].GrpHdr[0].InstdAgt[0].FinInstnId[0].Othr[0].Id[0];

                        const data = {
                          eth_ref: orgnlTxId,
                          debitor_name: debitor,
                          creditor_name: creditor,
                          creditor_account:creditorAccount,
                          debitor_account:debitorAccount,
                          bank: receiverBank,
                          amount
                        };
                        resolve({
                            status: true,
                            message: 'The XML response converted as expected',
                            data: data
                        });
                    } catch (extractionError) {
                        //console.error('Error extracting data from XML:', extractionError);
                        reject({
                            status: false,
                            message: 'Error extracting data from XML',
                            data: extractionError
                        });
                    }
                }
            });
        });
    } catch (error) {
        //console.error('Error converting XML response to JSON:', error);
        return {
            status: false,
            message: 'Error converting XML response to JSON',
            data: error
        };
    }
}


  module.exports = {
    xmlVerificationResponseTojson,xmlSignedPushRequestToJson,xmlPushPaymentResponseTojson,xmlPushPaymentStatusResponseTojson, xmlReturnPaymentResponseToJson
  };
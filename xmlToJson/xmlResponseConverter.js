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

  module.exports = {
    xmlVerificationResponseTojson
  };
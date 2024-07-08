const { create } = require('xmlbuilder2');

const generateXmlDocument = (jsonInput) => {
  const xmlDoc = create({ version: '1.0', encoding: 'UTF-8', standalone: true })
    .ele('FPEnvelope', {
      'xmlns:header': 'urn:iso:std:iso:20022:tech:xsd:head.001.001.03',
      'xmlns:document': 'urn:iso:std:iso:20022:tech:xsd:acmt.023.001.03',
      'xmlns': 'urn:iso:std:iso:20022:tech:xsd:verification_request'
    })
    .ele('header:AppHdr')
    .ele('header:Fr')
    .ele('header:FIId')
    .ele('header:FinInstnId')
    .ele('header:Othr')
    .ele('header:Id').txt(jsonInput.FromFinInstnId).up().up().up().up().up()
    .ele('header:To')
    .ele('header:FIId')
    .ele('header:FinInstnId')
    .ele('header:Othr')
    .ele('header:Id').txt(jsonInput.ToFinInstnId).up().up().up().up().up()
    .ele('header:BizMsgIdr').txt(jsonInput.BizMsgIdr).up()
    .ele('header:MsgDefIdr').txt(jsonInput.MsgDefIdr).up()
    .ele('header:CreDt').txt(jsonInput.CreDt).up().up()
    .ele('document:Document')
    .ele('document:IdVrfctnReq')
    .ele('document:Assgnmt')
    .ele('document:MsgId').txt(jsonInput.MsgId).up()
    .ele('document:CreDtTm').txt(jsonInput.CreDtTm).up()
    .ele('document:Assgnr')
    .ele('document:Agt')
    .ele('document:FinInstnId')
    .ele('document:Othr')
    .ele('document:Id').txt(jsonInput.FromFinInstnId).up().up().up().up().up()
    .ele('document:Assgne')
    .ele('document:Agt')
    .ele('document:FinInstnId')
    .ele('document:Othr')
    .ele('document:Id').txt(jsonInput.ToFinInstnId).up().up().up().up().up().up()
    .ele('document:Vrfctn')
    .ele('document:Id').txt(jsonInput.VrfctnId).up()
    .ele('document:PtyAndAcctId')
    .ele('document:Acct')
    .ele('document:Id')
    .ele('document:Othr')
    .ele('document:Id').txt(jsonInput.account_number).up()
    .ele('document:SchmeNm')
    .ele('document:Prtry').txt(jsonInput.bank);

  // Convert the XML document to string format with XML declaration
  const xmlString = xmlDoc.end({ prettyPrint: true });

  // Return the XML string with the XML declaration
  return xmlString;
};

module.exports = {
  generateXmlDocument
};

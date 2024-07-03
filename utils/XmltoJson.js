const xml2js = require('xml2js');
const { promisify } = require('bluebird');
exports.XmltoJson = async () => {
  const xmlData = `<?xml version="1.0"?>
  <FPEnvelope xmlns:header="urn:iso:std:iso:20022:tech:xsd:head.001.001.03" xmlns:document="urn:iso:std:iso:20022:tech:xsd:acmt.023.001.03" xmlns="urn:iso:std:iso:20022:tech:xsd:verification_request">
    <header:AppHdr>
      <header:Fr>
        <header:FIId>
          <header:FinInstnId>
            <header:Othr>
              <header:Id>ABAYETAA</header:Id>
            </header:Othr>
          </header:FinInstnId>
        </header:FIId>
      </header:Fr>
      <header:To>
        <header:FIId>
          <header:FinInstnId>
            <header:Othr>
              <header:Id>ETSETAAXX</header:Id>
            </header:Othr>
          </header:FinInstnId>
        </header:FIId>
      </header:To>
      <header:BizMsgIdr>ABAYETAAXXX20240701134539555</header:BizMsgIdr>
      <header:MsgDefIdr>acmt.023.001.03</header:MsgDefIdr>
      <header:CreDt>2024-07-01T13:45:39.555Z</header:CreDt>
    </header:AppHdr>
    <document:Document>
      <document:IdVrfctnReq>
        <document:Assgnmt>
          <document:MsgId/>
          <document:CreDtTm/>
          <document:Assgnr>
            <document:Agt>
              <document:FinInstnId>
                <document:Othr>
                  <document:Id>ABAYETAA</document:Id>
                </document:Othr>
              </document:FinInstnId>
            </document:Agt>
          </document:Assgnr>
          <document:Assgne>
            <document:Agt>
              <document:FinInstnId>
                <document:Othr>
                  <document:Id>ETSETAAXX</document:Id>
                </document:Othr>
              </document:FinInstnId>
            </document:Agt>
          </document:Assgne>
        </document:Assgnmt>
        <document:Vrfctn>
          <document:Id>ABAYETAAXXX20240701134539555</document:Id>
          <document:PtyAndAcctId>
            <document:Acct>
              <document:Id>
                <document:Othr>
                  <document:Id/>
                  <document:SchmeNm>
                    <document:Prtry/>
                  </document:SchmeNm>
                </document:Othr>
              </document:Id>
            </document:Acct>
          </document:PtyAndAcctId>
        </document:Vrfctn>
      </document:IdVrfctnReq>
    </document:Document>
  </FPEnvelope>`


  try {
    console.log('Parsing XML...');
    const parseStringAsync = promisify(xml2js.parseString);
    const result = await parseStringAsync(xmlData, { explicitArray: false, trim: true });
    // console.log(JSON.stringify(result, null, 2));
    return { 'JSON result': JSON.stringify(result, null, 2) };
  } catch (err) {
    console.error('Error parsing XML:', err);
    return { 'Error parsing XML': err };
  }
};


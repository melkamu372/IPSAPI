Header (AppHdr)

1. **From (Fr)**

Field Path: header:AppHdr/header:Fr/header:FIId/header:FinInstnId/header:Othr/header:Id
Value: `ABAYETAA`
Format: Alphanumeric (max length: 35)
Description: Identifier of the financial `institution initiating` the message.


2. **To (To)**

Field Path: header:AppHdr/header:To/header:FIId/header:FinInstnId/header:Othr/header:Id
Value: `ETSETAAXX`
Format: Alphanumeric (max length: 35)
Description: Identifier of the financial institution receiving the message.


3. **Business Message Identifier (BizMsgIdr)**

Field Path: header:AppHdr/header:BizMsgIdr
Value: `CBETETAAXXX20240701055223827`
Format: Alphanumeric (max length: 35)
Description: Unique identifier for the business message.


4. **Message Definition Identifier (MsgDefIdr)**

Field Path: header:AppHdr/header:MsgDefIdr
Value: acmt.023.001.03
Format: Alphanumeric (max length: 35)
Description: Identifies the type of the ISO 20022 message.


5. **Creation Date (CreDt)**

Field Path: header:AppHdr/header:CreDt
Value: 2023-06-24T00:00:00.000Z
Format: ISO 8601 date and time (YYYY-MM-DDTHH:MM.sssZ)
Description: Date and time when the header was created.

# The body of the message the most valuable

## Document (Document)
**Message Identification (MsgId)**
Field Path: document:Document/document:IdVrfctnReq/document:Assgnmt/document:MsgId
Value: CBETETAAXXX20240701055223828
Format: Alphanumeric (max length: 35)
Description: Unique identifier for the assignment message.

**Creation Date Time (CreDtTm)**
Field Path: document:Document/document:IdVrfctnReq/document:Assgnmt/document:CreDtTm
Value: 2023-06-24T00:00:00.000+03:00
Format: ISO 8601 date and time with timezone (YYYY-MM-DDTHH:MM
.sss+hh
)
Description: Date and time when the assignment message was created.

**Assigner (Assgnr)**
Field Path: document:Document/document:IdVrfctnReq/document:Assgnmt/document:Assgnr/document:Agt/document:FinInstnId/document:Othr/document:Id
Value: ABAYETAA
Format: Alphanumeric (max length: 35)
Description: Identifier of the financial institution assigning the message.

**Assignee (Assgne)**
Field Path: document:Document/document:IdVrfctnReq/document:Assgnmt/document:Assgne/document:Agt/document:FinInstnId/document:Othr/document:Id
Value: ETSETAAXX
Format: Alphanumeric (max length: 35)
Description: Identifier of the financial institution receiving the assignment.

**Verification (Vrfctn)**
Field Path: document:Document/document:IdVrfctnReq/document:Vrfctn/document:Id
Value: CBETETAAXXX7512717326723
Format: Alphanumeric (max length: 35)
Description: Unique identifier for the verification request.

**Account Identification (Acct/Id/Othr/Id)**

Field Path: document:Document/document:IdVrfctnReq/document:PtyAndAcctId/document:Acct/document:Id/document:Othr/document:Id
Value: 1000092296998
Format: Alphanumeric (max length: 35)
Description: Identifier of the account to be verified.
**Account Scheme Name (Acct/Id/Othr/SchmeNm/Prtry)**
Field Path: document:Document/document:IdVrfctnReq/document:PtyAndAcctId/document:Acct/document:Id/document:Othr/document:SchmeNm/document:Prtry
Value: 231402
Format: Alphanumeric (max length: 35)
Description: Proprietary scheme name for the account identification.
// idUtils.js
exports.generateBizMsgIdr = () => {
    const prefix = "ABAYETAAXXX";
    const date = new Date();
  
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${prefix}${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  };
  
  exports.GenerateVerificationMsgId = () => {
    const prefix = "ABAYETAAXXX";
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${prefix}${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  };
  
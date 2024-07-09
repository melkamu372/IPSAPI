exports.getISO8601Date=()=> {
    const date = new Date();
    return date.toISOString();
  }
  
  // Function to get current date and time in ISO 8601 format with timezone offset
exports.getEastAfricanISO8601 = () => {
  const date = new Date();
  const timezoneOffset = 3 * 60 * 60 * 1000; 
  const eastAfricanDate = new Date(date.getTime() + timezoneOffset);
  const isoDateTime = eastAfricanDate.toISOString().slice(0, -1) + '+03:00';
  return isoDateTime;
};


exports.generateBizMsgIdr = () => {
  const prefix = "ABAYETAA";
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

exports.generateMsgId = () => {
  const prefix = "ABAYETAA";
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

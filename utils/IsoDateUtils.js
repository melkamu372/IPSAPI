exports.getCurrentDateInISO8601=()=> {
    const date = new Date();
    return date.toISOString();
  }
  

  // Function to get current date and time in ISO 8601 format with timezone offset
exports.getCurrentDateINEastAfricanISO8601 = () => {
  const date = new Date();

  // Calculate the time difference in milliseconds between UTC and EAT
  const timezoneOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

  // Create a new Date object with the desired timezone offset (UTC+3)
  const eastAfricanDate = new Date(date.getTime() + timezoneOffset);

  // Format the date in ISO 8601 with the timezone offset (+03:00)
  const isoDateTime = eastAfricanDate.toISOString().slice(0, -1) + '+03:00';

  return isoDateTime;
};

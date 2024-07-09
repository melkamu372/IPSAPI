const axios = require('axios');
const {digest_url}=require ('../utils/urls');
async function digestXml(xmlData) {
    try {
      const response = await axios.post(digest_url, xmlData, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
      return response.data;
    } catch (error) {
      //console.error('Error digesting XML:', error);
      return "";
    }
  }

  module.exports = {
    digestXml
  };
  
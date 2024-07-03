const { Validator } = require('xsd-schema-validator');

exports.XsdsValidation = async (xmlData, XSD_PATH) => {
 
    try {
      
        await new Validator().validateXML(xmlData, XSD_PATH);
        console.log('XML is valid according to XSD.');
        return true;
    } catch (err) {
        console.error('XML validation error:', err);
        return false;
    }
};

const { Validator } = require('xsd-schema-validator');
exports.XsdsValidation = async (xmlData, XSD_PATH) => {
    try {
      
        const response=await new Validator().validateXML(xmlData, XSD_PATH);
        if(response.valid){
        return true;
        }
        else{
        console.log('XML is not  valid according to XSD.');
        return false;
        } 
         
    } catch (err) {
        console.error('XML validation error:', err);
        return false;
    }
};

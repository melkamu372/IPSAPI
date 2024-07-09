const logger = require('../logs/logger');
const {GenerateAccessToken,RefreshToken,getLastToken,isTokenExpired,getAccessToken}=require("../services/token-service");
const {XmltoJson} =require("../utils/XmltoJson");


exports.testAPI = async (req, res) => {
  try {
    const testPlayload = {
      name:"access api test",
      connection:"test success "
    };
    logger.info('check access controller work');
    res.status(200).json(testPlayload);
  } catch (error) {
    logger.error(`Error retrieving users: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.GenerateAccesToken = async (req, res) => {
  try {
      const response = await GenerateAccessToken();
      console.log("get response controller");
      console.log(response);
      res.status(200).json(response);
  } catch (error) {
    logger.error(`Error retrieving token: ${error.message}`);
    console.log(error);
    res.status(400).json({status: false, message: error.message });
  }
};

exports.RefreshToken = async (req, res) => {
  const refresh_token=req.query.refreshToken;
  try {
    const response= await RefreshToken(refresh_token);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: 'Failed to create token' });
    }
  } catch (error) {
    logger.error(`Error retrieving token: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getLastToken = async (req, res) => {
  try {
    const response =await getLastToken();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ 
      status: false,
      message: `Error fetching last token: ${error}`
    });
  }
};

exports.isTokenExpired = async (req, res) => {
  const accessToken=req.query.accessToken;
  try {
    const response=await isTokenExpired(accessToken);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ 
      status:true,
      message: `'Error checking token expiration:', ${error}`
     });
  }
};
exports.getAccessToken= async (req, res) => {
  try {
    const response=await getAccessToken();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ 
      status:true,
      message: `'Error checking token expiration:', ${error}`
     });
  }
};

exports.getjson= async (req, res) => {
  try {
    const response=await XmltoJson();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ 
      status:true,
      message: `'Error checking token expiration:', ${error}`
     });
  }
};





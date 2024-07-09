const axios = require('axios');
const qs = require('qs');
const {token_model}=require('../models/db_models/access_tables');
const {access_url}=require ('../utils/urls');
const logger = require('../logs/logger');
  exports.getLastToken = async () => {
    try {
      const token = await token_model.findOne({
        order: [['createdAt', 'DESC']]
      });
      if (!token) {
        return { 
          status: false,
          message: "Token not found"
        };
      } else {
        return { 
          status: true,
          message: 'Token found',
          token: token
        };
      }
    } catch (error) {
      return { 
        status: false,
        message: `Internal server Error fetching last token: ${error}`
      };
    }
  };
  
exports.GenerateAccessToken = async()=> {
  try {
    const username = 'abay';
    const password = 'abay1';
    const token = await axios.post(access_url, qs.stringify({
      grant_type: 'password',
      username: username,
      password: password
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'jwt-assertion': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBQkFZRVRBQSIsImNlcnRfaXNzIjoiQ049VEVTVCBFVFMgSVBTIElzc3VpbmcgQ0EsIE89RXRoU3dpdGNoLCBDPUVUIiwiY2VydF9zbiI6IjQyMzcxNDE1OTE1MzI3NDIyMzk3MzIwNDExNjMxNDc3NTk0MjE5MTkwNjg4OSIsImp0aSI6IjE3NzY0MTIxMzEwMDAiLCJleHAiOjE3NzY0MTIxMzEsImFsZyI6IlJTMjU2In0.lrGwOyDMNWcKH3I0cAw6nAX2eD7B8sZuRMcYxyd_vkKh9slTCWPbkFiKK4EFcgmxT68jY-WxeCFRJicbRg0cs4GZoV9J-EKWjWowrDi74DHaPkXQBiO9hXnymWIaL_3nltxRmqRncZPDk36moN734gKU5ND75xzjnnmtqTmR24-yxO62eoaxG_N3lYqOq6wY-52T3wIi-gxtNYLwMpLICnNNezsKPxAvYScs7xDv9yiiDiLeYBAX0fslH8Hj5QCfEO5zBaq-55yPN6ypg6LXG-Kz1MIRcwkhJIN7PY_23tdSMw5zBzqNrpJgCZakgVXX3ybW_GbhBlsZmzItYeHAfw'
      }
    });
 
    if(!token){
        return { status:false, message:"Unable to access IPS server" };
      }
    const now = new Date();
    const expiresAt = new Date(now.getTime() + token.data.expires_in * 1000);
    const refreshExpiresAt = new Date(now.getTime() + token.data.refresh_expires_in * 1000);
    const tokenData = {
      accessToken: token.data.access_token,
      refreshToken: token.data.refresh_token,
      expiresAt: expiresAt,
      refreshExpiresAt: refreshExpiresAt,
    };
    const createdToken = await token_model.create(tokenData);
    // Check if the token was created successfully
    if (createdToken) {
      return { status:true, token: createdToken, message:"Token Created successfully" };
    } else {
        return { status: false,message: 'Failed to create token' };
    }
  } catch (error) {
    logger.error(`Error retrieving token: ${error.message}`);
    return { status: false,message: error.message };
  }
};

exports.RefreshToken = async (refresh_token) => {
    try {
         if(!refresh_token) {
            return { status:false, message:"please provide refresh token" };
          }
      const response = await axios.post(`${access_url}`,qs.stringify({
       grant_type: 'refresh_token',
      refresh_token:refresh_token,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'jwt-assertion': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBQkFZRVRBQSIsImNlcnRfaXNzIjoiQ049VEVTVCBFVFMgSVBTIElzc3VpbmcgQ0EsIE89RXRoU3dpdGNoLCBDPUVUIiwiY2VydF9zbiI6IjQyMzcxNDE1OTE1MzI3NDIyMzk3MzIwNDExNjMxNDc3NTk0MjE5MTkwNjg4OSIsImp0aSI6IjE3NzY0MTIxMzEwMDAiLCJleHAiOjE3NzY0MTIxMzEsImFsZyI6IlJTMjU2In0.lrGwOyDMNWcKH3I0cAw6nAX2eD7B8sZuRMcYxyd_vkKh9slTCWPbkFiKK4EFcgmxT68jY-WxeCFRJicbRg0cs4GZoV9J-EKWjWowrDi74DHaPkXQBiO9hXnymWIaL_3nltxRmqRncZPDk36moN734gKU5ND75xzjnnmtqTmR24-yxO62eoaxG_N3lYqOq6wY-52T3wIi-gxtNYLwMpLICnNNezsKPxAvYScs7xDv9yiiDiLeYBAX0fslH8Hj5QCfEO5zBaq-55yPN6ypg6LXG-Kz1MIRcwkhJIN7PY_23tdSMw5zBzqNrpJgCZakgVXX3ybW_GbhBlsZmzItYeHAfw'
        }
      });
  
  const token=response.data;
      if(!token){
        return { status:false, message:"Unable to access IPS server" };
      }

     const now = new Date();
      const expiresAt = new Date(now.getTime() + token.expires_in * 1000);
      const refreshExpiresAt = new Date(now.getTime() +token.refresh_expires_in * 1000);
      const tokenData= {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt:expiresAt,
        refreshExpiresAt:refreshExpiresAt,
      };
  
      const createdToken = await token_model.create(tokenData);
      // Check if the token was created successfully
      if (createdToken) {
        return { status:true, token:createdToken, message:"Token Created successfully" };
      } else {
        return { status:false, message:"Failed to create token" };
      }
    } catch (error) {
      logger.error(`Refresh: Error creating token: ${error.message}`);
      return { status:false, message:error.message };
    }
  };
  
exports.isTokenExpired = async (accessToken) => {
  try {
    if (!accessToken) {
      return {
        status: true,
        message: "AccessToken is not provided"
      };
    }
    const response = await token_model.findOne({ where: { accessToken: accessToken } });
    if (!response) {
      return {
        status: true,
        message: "Token not found"
      };
    }
    const token = response.dataValues;
    const now = new Date();
    const expirationTime = new Date(token.expiresAt).getTime();
    const bufferTime = 3.5 * 60 * 1000; // 30 minutes buffer time in milliseconds
    const willExpireIn30Minutes = expirationTime - now.getTime() <= bufferTime;
    if (willExpireIn30Minutes) {
      return {
        status: true,
        message: "Token either expired or will expire in 3 minutes"
      };
    } else {
      return {
        status: false,
        message: "Token will not expire in 3 minutes"
      };
    }
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return {
      status: true,
      message: `Internal Error checking token expiration: ${error.message}`
    };
  }
};

exports.getAccessToken=async()=> {
    try {
    const response = await token_model.findOne({
            order: [['createdAt', 'DESC']]
          }); 
        let token = response.dataValues;
       if (!token) {
           const newToken= await AccessTokenGenerator();
           token = newToken.token;   
       }    
       const now = new Date();
       const expirationTime = token.expiresAt.getTime();
       const bufferTime = 3.5 * 60 * 1000; // 3.5 minutes buffer time in milliseconds
       const willExpireIn30Minutes = expirationTime - now.getTime() <= bufferTime;
       
       if (willExpireIn30Minutes) {
           const newresponse= await AccessTokenGenerator();
           token = newresponse.token;
       } 
       
    return {
           status:true,
           message: "Token retrived successfully",
           token:token.accessToken
         };
     } catch (error) {
       return{
         status: false,
         message: `Internal Error checking token expiration: ${error.message}`,
         token:""
       };
     }
   };

   async function AccessTokenGenerator(){
    try {
    const username = 'abay';
    const password = 'abay1';
    const response = await axios.post(access_url, qs.stringify({
      grant_type: 'password',
      username: username,
      password: password
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'jwt-assertion': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBQkFZRVRBQSIsImNlcnRfaXNzIjoiQ049VEVTVCBFVFMgSVBTIElzc3VpbmcgQ0EsIE89RXRoU3dpdGNoLCBDPUVUIiwiY2VydF9zbiI6IjQyMzcxNDE1OTE1MzI3NDIyMzk3MzIwNDExNjMxNDc3NTk0MjE5MTkwNjg4OSIsImp0aSI6IjE3NzY0MTIxMzEwMDAiLCJleHAiOjE3NzY0MTIxMzEsImFsZyI6IlJTMjU2In0.lrGwOyDMNWcKH3I0cAw6nAX2eD7B8sZuRMcYxyd_vkKh9slTCWPbkFiKK4EFcgmxT68jY-WxeCFRJicbRg0cs4GZoV9J-EKWjWowrDi74DHaPkXQBiO9hXnymWIaL_3nltxRmqRncZPDk36moN734gKU5ND75xzjnnmtqTmR24-yxO62eoaxG_N3lYqOq6wY-52T3wIi-gxtNYLwMpLICnNNezsKPxAvYScs7xDv9yiiDiLeYBAX0fslH8Hj5QCfEO5zBaq-55yPN6ypg6LXG-Kz1MIRcwkhJIN7PY_23tdSMw5zBzqNrpJgCZakgVXX3ybW_GbhBlsZmzItYeHAfw'
      }
    });
    
    const token=response.data; 

      if(!token){
          return { status:false, message:"Unable to access IPS server" };
        }
        
      const now = new Date();
      const expiresAt = new Date(now.getTime() + token.expires_in * 1000);
      const refreshExpiresAt = new Date(now.getTime() + token.refresh_expires_in * 1000);
      const tokenData = {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt: expiresAt,
        refreshExpiresAt: refreshExpiresAt,
      };
      const createdToken = await token_model.create(tokenData);
      // Check if the token was created successfully
      if (createdToken) {
        return { status:true, token: createdToken.dataValues, message:"Token Created successfully" };
      } else {
          return { status: false,message: 'Failed to create token' };
      }
    } catch (error) {
      logger.error(`Error retrieving token: ${error.message}`);
      return { status: false,message: error.message };
    }
  };
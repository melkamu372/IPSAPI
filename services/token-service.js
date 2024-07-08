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
 
    
   // const token ={"access_token":"eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfeGlQSDB2bXRKck9qT3JFQ0c2VFlNRk5zUFNuaExZN0duaUlaYTJtS2owIn0.eyJleHAiOjE3MTkyNzM0OTUsImlhdCI6MTcxOTIzNzQ5NSwianRpIjoiMGNiMDJjOWYtNTIyZC00YWVmLTkzZjktNWUyYzEzYmU3YmNkIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMjAuNDU6ODA4MC9hdXRoL3JlYWxtcy9BcGkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNjU3NmMwN2MtNWI5MC00MmMxLWE0MzYtN2Y1NmQwMTRjZjQ1IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiUlBfUHJvY2Vzc2luZyIsInNlc3Npb25fc3RhdGUiOiI1MzM2NTM5OS05NGNlLTQ0MzAtYTY1MS0yNTExNjQ0NzFhMDEiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYXBpIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjUzMzY1Mzk5LTk0Y2UtNDQzMC1hNjUxLTI1MTE2NDQ3MWEwMSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmF5IiwiYmljIjoiQUJBWUVUQUEiLCJpbnN0aXR1dGlvbl9pZCI6IjI3MjAifQ.hZ_inWzu-A_qAX7XmytduMwDX_6Bs69QkqZaN6Ntzf6A3_9h1FoOheWFipCHz9OtEJNrGAGp9kMCoOSdRF3ukebHWH3YWz2GPQOJdcd_1bTdo7LbCSMPCd5_NHOZSPqQ5GjVnbWp0XAO0cgpRcBlZI-WGV_ElxZaUqxA-bakhbug7XBZCyYVs5SSewpmcqVjo67EszHpYqMC1sZvjTxuwYlZXyGYAcrYP1_se7uENtYrlvVvQA1pN6P0XRPlv5SaOvjwTVdMHjmCBy8U9DeCETTWqgW5IMwFbppJ4wux8VbNrimfteS7YHnyNxoe215mY-5xAVkpXTibctToMq8TrQ","expires_in":36000,"refresh_expires_in":1800,"refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxNTRhYWMzOS00YTUyLTQ5NmUtODBlYi00MThjM2Y2NzcxOTMifQ.eyJleHAiOjE3MTkyMzkyOTUsImlhdCI6MTcxOTIzNzQ5NSwianRpIjoiYjI5MjZiODQtMmUwZS00YzExLWJjMzUtMzA3Y2VhZDFmNmIwIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMjAuNDU6ODA4MC9hdXRoL3JlYWxtcy9BcGkiLCJhdWQiOiJodHRwOi8vMTkyLjE2OC4yMC40NTo4MDgwL2F1dGgvcmVhbG1zL0FwaSIsInN1YiI6IjY1NzZjMDdjLTViOTAtNDJjMS1hNDM2LTdmNTZkMDE0Y2Y0NSIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJSUF9Qcm9jZXNzaW5nIiwic2Vzc2lvbl9zdGF0ZSI6IjUzMzY1Mzk5LTk0Y2UtNDQzMC1hNjUxLTI1MTE2NDQ3MWEwMSIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjUzMzY1Mzk5LTk0Y2UtNDQzMC1hNjUxLTI1MTE2NDQ3MWEwMSJ9.OSkOB7kdjpXCOhATdcP_PeJQ_7y75CI0XF-k8AKEGiU","token_type":"Bearer","not-before-policy":0,"session_state":"53365399-94ce-4430-a651-251164471a01","scope":"profile email"};
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
    console.error(`Error retrieving token: ${error.message}`);
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
       const bufferTime = 3.5 * 60 * 1000; // 30 minutes buffer time in milliseconds
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
      console.error(`Error retrieving token: ${error.message}`);
      return { status: false,message: error.message };
    }
  };
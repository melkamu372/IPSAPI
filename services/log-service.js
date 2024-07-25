
const {transact_log,transfers}=require('../models/db_models/access_tables');
const logger = require('../logs/logger');
exports.RegisterTransferLog=async(data)=> {
    try {
      data.createdAt=new Date();
      const transaction_log = await transfers.create(data);
      if (transaction_log) {
        return {
          status:true,
          message: "Transaction registered correctly",
          log:transaction_log
        };
      
      } else {
          return { status: false,message: 'Failed to create token' };
      }
     } catch (error) {
       return{
         status: false,
         message: `Internal Error checking token expiration: ${error.message}`,
         log:""
       };
     }
   };

exports.RegisterTransactionLog=async(data)=> {
    try {
      data.createdAt=new Date();
      const transaction_log = await transact_log.create(data);
      // Check if the log was created successfully
      if (transaction_log) {
        return {
          status:true,
          message: "Transaction registered correctly",
          log:transaction_log
        };
      
      } else {
          return { status: false,message: 'Failed to create token' };
      }
     } catch (error) {
       return{
         status: false,
         message: `Internal Error checking token expiration: ${error.message}`,
         log:""
       };
     }
   };
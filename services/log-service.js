
const {transact_log,transfers}=require('../models/db_models/access_tables');
const logger = require('../logs/logger');
const { Op } = require('sequelize'); // Import Op from Sequelize
const {getPaymentStatus}=require("./push-payment-service");
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

  exports.UpdateTransferLogs = async (data) => {
  try {
   await UpdateTransferLog(data.id,data);
    
  } catch (error) {
  
  console.log('Error fetching transfer log:', error);
  }
};


  const UpdateTransferLog = async (id, data) => {
   try {
    const [updated] = await transfers.update(data, {
      where: { id: id }
    });
    
    if (updated) {
      console.log("Transaction log updated successfully");
    } else {
      console.log("Transaction log not found");
    }
  } catch (error) {
    console.error('Error updating transaction log:', error);
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
   
   exports.UpdateTransactionLog = async (id, data) => {
     try {
       const [updated] = await transact_log.update(data, {
         where: { id: id }
       });
       if (updated) {
          console.log("Transaction log updated successfully"); 
           } else {
           console.log("Transaction log not found"); 
         }
     } catch (error) {
      console.log('Error updating transaction log:', error);
        }
   };
   
  exports.CheckTransfer = async (req, res) => {
    try {
      // Get today's date
     const today = new Date();
     const startOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));// start of today
     const endOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)); // End of today

// Fetch records where status is 'Failed' or 'Error' and createdAt is today
const transactionLog = await transfers.findAll({
  where: {
    [Op.or]: [
      { status: 'Failed' }, // Fetch where status is 'Failed'
      { status: 'Error' }   // Fetch where status is 'Error'
    ],
    createdAt: {
      [Op.between]: [startOfDay, endOfDay] // Ensure createdAt is within today's full calendar day
    }
  },
  order: [['createdAt', 'ASC']]
});
      
      console.log("Currently number of Failed Transactions = ", transactionLog.length);
      // Process each log asynchronously
      const processingLogs = transactionLog.map(async (log) => {
        if (log.eth_ref!=null) {
          const body = {
            transactionRef: log.eth_ref,
            bankCode: log.bank
          };  
          try {
            const response = await getPaymentStatus(body);
            if (response.status === "SUCCESS") {
              await UpdateTransferLog(log.id, { status: "SUCCESS" });
            } else if (response.status === "ERROR") {
            // Reverse function here
              await UpdateTransferLog(log.id, { status: "ERROR" });
              //console.log("Error", log.eth_ref);
            } else {
            
            // Reverse function here
              await UpdateTransferLog(log.id, { status: "Reversed" });
              console.log("Reversed", log.eth_ref);
            }
          } catch (error) {
            console.log(`Error processing log with eth_ref ${log.eth_ref}:`, error);
          }
        }
      });
  
      await Promise.all(processingLogs);
  
    } catch (error) {
      console.log('Error fetching transfer log:', error);
    }
  };

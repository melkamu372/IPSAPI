
const {transact_log,transfers}=require('../models/db_models/access_tables');
const logger = require('../logs/logger');
const { Op } = require('sequelize'); // Import Op from Sequelize
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
      console.log('Error updating transaction log:', error);
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
    const transactionLog = await transfers.findAll({
      where: { status: { [Op.ne]: 'SUCCESS' } }, // Fetch where status is not 'SUCCESS'
      order: [['createdAt', 'ASC']]
    });

    console.log("Length", transactionLog.length);

    //Process each log asynchronously
    for (const log of transactionLog) {
    
    
      if (log.eth_ref === "ABAYETAA7203392752340") {
        
        await UpdateTransferLog(log.id, { status: "Failure" });
        console.log("Update log:", log.id);
      }
    }
    
  } catch (error) {
  
  console.log('Error fetching transfer log:', error);
  }
};
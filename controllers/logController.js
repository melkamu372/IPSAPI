const logger = require('../logs/logger');
const {transact_log,transfers}=require('../models/db_models/access_tables');
const {RegisterTransactionLog,RegisterTransferLog}=require("../services/log-service");
exports.getTransfer_log = async (req, res) => {
  try {
    const transaction_log = await transfers.findAll({
      order: [['createdAt', 'DESC']]
    });
    logger.info('transfer_log controller');
    res.status(200).json({length:transaction_log.length,log:transaction_log})
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getTransaction_log = async (req, res) => {
  try {
    const transaction_log = await transact_log.findAll({
      order: [['createdAt', 'DESC']]
    });

    logger.info('transaction_log controller');
    res.status(200).json({length:transaction_log.length,log:transaction_log})
  } catch (error) {
    res.status(400).json(error);
  }
};


exports.RegistrationTransfer_log = async (req, res) => {
  try {
    const transaction_log = await RegisterTransferLog(req.body);
    logger.info('transaction_log controller');
    res.status(200).json(transaction_log);
  } catch (error) {
    res.status(400).json(error);
  }
};




exports.RegistrationTransaction_log = async (req, res) => {
  try {
    const transaction_log = await RegisterTransactionLog(req.body);
    logger.info('transaction_log controller');
    res.status(200).json(transaction_log);
  } catch (error) {
    res.status(400).json(error);
  }
};





const logger = require('../logs/logger');
exports.testAPI = async (req, res) => {
  try {
    const testPlayload = {
      name:"test",
      connection:"good"
    };
    logger.info('check connection');
    res.status(200).json(testPlayload);
  } catch (error) {
    logger.error(`Error retrieving users: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const express = require('express');
const dotenv = require('dotenv');
const logger = require('./logs/logger');
dotenv.config();
const testRoutes = require('./routes/IPSRoutes');
const {sequelize} = require('./config/db_con_pool');
const {token_model}=require('./models/db_models/access_tables');
const app = express();
app.use(express.json());
app.use('/api', testRoutes);
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  logger.error(`Failed to sync database: ${error.message}`);
});

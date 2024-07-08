const express = require('express');
const bodyParser = require('body-parser');
const bodyParserXml = require('body-parser-xml');
const dotenv = require('dotenv');
const logger = require('./logs/logger');
dotenv.config();

bodyParserXml(bodyParser);
const testRoutes = require('./routes/IPSRoutes');
const {sequelize} = require('./config/db_con_pool');
const {token_model}=require('./models/db_models/access_tables');
const app = express();
app.use(express.json());

// Middleware for parsing XML
app.use(bodyParser.xml({
  limit: '1MB',   // Reject payloads larger than 1MB
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false // Only put nodes in array if >1
  }
}));

app.use('/api', testRoutes);
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  logger.error(`Failed to sync database: ${error.message}`);
});

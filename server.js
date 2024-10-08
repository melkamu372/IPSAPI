const express = require('express');
const bodyParser = require('body-parser');
const bodyParserXml = require('body-parser-xml');
const dotenv = require('dotenv');
const logger = require('./logs/logger');
const { GenerateAccessToken } = require('./services/token-service');
const {CheckTransfer}=require("./services/log-service");
const {getPaymentStatus}=require("./services/push-payment-service");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON requests
app.use(express.json());

// Middleware for parsing XML
bodyParserXml(bodyParser);
app.use(bodyParser.xml({
  limit: '1MB',   // Limit XML payload size
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false // Only put nodes in array if >1
  }
}));

// Additional middleware for raw XML text
app.use(express.text({ type: 'application/xml' }));

// Routes
const testRoutes = require('./routes/IPSRoutes'); // JSON routes
const incomingRoutes = require('./routes/IPSXmlRoutes'); // XML routes

app.use('/api', testRoutes);  // Mount JSON routes
app.use('/abay', incomingRoutes);  // Mount XML routes

// Start server
app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);

  // Call GenerateAccessToken immediately
  try {
    await GenerateAccessToken();
    await CheckTransfer();
  } catch (error) {
  logger.error(`Error generating token on startup: ${error.message}`);
  }

  // Timer to generate token every 4 minutes
  setInterval(async () => {
    try {
      await GenerateAccessToken();
      await CheckTransfer();
    } catch (error) {
      logger.error(`Error generating token in interval: ${error.message}`);
    }
  }, 4 * 60 * 1000); // 4 minutes in milliseconds
});

const express = require('express');
const bodyParser = require('body-parser');
const bodyParserXml = require('body-parser-xml');
const dotenv = require('dotenv');
const logger = require('./logs/logger');

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
app.use('/incoming', incomingRoutes);  // Mount XML routes

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const app = express();

app.use(express.static(process.env.STATIC_ASSETS_PATH || 'assets'));

if (process.env.STATIC_COMPRESSION_ENABLED === 'true') {
  app.use(compression());
}

app.listen(process.env.STATIC_PORT || 8000);

var express = require('express'),
  app = express(),
  compress = require('compression')();

app.use(compress);
app.use(express.static(__dirname + '/public'));

app.listen(8080);
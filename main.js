var express = require('express');
var app = express();
var compress = require('compression')();

app.use(compress);
app.use(express.static(__dirname + '/public'));

app.listen(8080);

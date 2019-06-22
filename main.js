var express = require('express');
var proxy = require('http-proxy-middleware');
var app = express();
var compress = require('compression')();

app.use("/resume", express.static(__dirname + '/public'));
app.use("/compilers", express.static(__dirname + '/public/compilers'));

app.use("/", proxy({
  target: 'http://198.199.110.247:2367',
}));

app.use(compress);

app.listen(8080);

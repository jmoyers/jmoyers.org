var express = require('express');

var app = express.createServer();

app.configure(function(){
   app.use(express.logger());
   app.use(express.static(__dirname + '/public'));
});

app.listen(8080)
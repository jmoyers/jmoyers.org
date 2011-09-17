var express = require('express');

var app = express.createServer();

app.configure(function(){
   app.use(express.logger());
   app.use(express.static(__dirname + '/public'));
});

app
   .use(express.vhost('jmoyers.org', app))
   .use(express.vhost('www.jmoyers.org', app))
   .use(express.vhost('jmoyers.me', app))   
   .use(express.vhost('www.jmoyers.me', app))
   .use(express.vhost('joshuamoyers.com', app))
   .use(express.vhost('www.joshuamoyers.com', app))

app.listen(8080)

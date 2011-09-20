var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express.createServer();

app.configure(function(){
   app.register('ejs', require('ejs'));
   app.register('html', require('ejs'));
   app.use(express.logger());
   app.use(express.static(__dirname + '/public'));
});

function urlify(string){                                               
   return string.replace(/ /g, '-')                                    
      .replace(/[^a-zA-Z\-]+/g, '')                                    
      .toLowerCase();                                                  
} 

fs.readdir('views', function(err, files){
   files.forEach(function(file){
      var view = urlify(file.substring(0, file.indexOf('.')));
      app.get('/' + view, function(req, res){
         res.render(file, {
            layout: 'layout/default.ejs'
         });
      });
   });
});

app.listen(8080)

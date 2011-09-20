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

var posts = [];

function createPostRoute(file){
   console.log('Creating route for %s', file);
   var view = urlify(file.substring(0, file.indexOf('.')));
   var handler = function(req, res){
      res.render(file, {
         layout: 'layout/default.ejs'
      });
   }
   app.get('/posts/' + view, handler);
   return handler;
}

fs.readdir('views', function(err, files){
   posts = files.filter(function(f){
      return ~f.indexOf('.html')
   }).map(createPostRoute);
   app.get('/', posts[0]);
});


app.listen(8080)

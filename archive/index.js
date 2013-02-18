var express = require('express');
var fs = require('fs');
var path = require('path');
var async = require('async');
var app = express.createServer();

app.configure(function(){
   app.register('ejs', require('ejs'));
   app.register('html', require('ejs'));
   app.use(express.logger());
   app.use(express.static(__dirname + '/public'));
});

function urlify(string){                                               
   return string.replace(/ /g, '-')                                    
      .replace(/[^a-zA-Z0-9\-]+/g, '')                                    
      .toLowerCase();                                                  
}

function createPostRoute(file, cb){
   console.log('Creating route for %s', file);
   fs.readFile(path.join('views',file), function(err, data){
      var dateMatch = /datetime=['"](.+)['"]/.exec(data.toString());
      var date = dateMatch[1]?new Date(dateMatch[1]):false; 
      var view = urlify(file.substring(0, file.indexOf('.')));
      var handler = function(req, res){
         res.render(file, {
            layout: 'layout/default.ejs'
         });
      }
      cb(null, {
         view: view,
         date: date,
         handler: handler
      });
   });
}

fs.readdir('views', function(err, files){
   files = files.filter(function(f){
      return f.match(/\.html$/);
   })
   
   async.map(files, createPostRoute, function(err, posts){
      posts = posts.sort(function(a, b){
         return b.date - a.date;
      });

      posts.forEach(function(post){
         app.get('/posts/' + post.view, post.handler);
      });

      app.get('/', posts[0].handler);
   });
});

app.listen(8080)

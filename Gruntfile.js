"use strict";

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      production: {
        options: {
          compress: true
        },
        files: {
          "public/css/main.css": ["src/style/*"]
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      production: {
        files: {
          "public/js/client.js": [
            "src/client_js/jquery-1.9.1.js", 
            "src/client_js/highlight.js",
            "src/client_js/bootstrap.js"
          ]
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'main.js'],
      options: {
        node: true,
        es5: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'src/style/*.less', 'src/style/*.css'],
      tasks: ['jshint', 'less', 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['jshint', 'uglify', 'less']);

};
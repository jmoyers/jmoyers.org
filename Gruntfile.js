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
          "public/style/main.css": [
            "src/main.less"
          ]
        }
      }
    },
    uglify: {
      production: {
        files: {
          "public/javascript/client.js": [
            "src/components/jquery/dist/jquery.js",
            "src/components/bootstrap/js/transition.js",
            "src/components/bootstrap/js/carousel.js",
            "src/components/source/highlight.js",
            "src/components/google/ga.js"
          ]
        }
      }
    },
    jshint: {
      files: [
        'gruntfile.js',
        'main.js'
      ],
      options: {
        node: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['jshint', 'uglify', 'less']);

};
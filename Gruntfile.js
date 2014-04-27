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
            "src/components/bootstrap/less/bootstrap.less",
            "src/source/github.css",
            "src/source/solarized.css",
            "src/main.less"
          ]
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      production: {
        files: {
          "public/javascript/client.js": [
            "src/components/bootstrap/js/carousel.js",
            "src/components/jquery/dist/jquery.js",
            "src/components/source/highlight.js"
          ]
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'main.js'],
      options: {
        node: true,
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
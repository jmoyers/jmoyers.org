module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      production: {
        options: {
          compress: true
        },
        files: {
          "public/css/main.css": "src/less/main.less"
        }
      }
    },
    uglify: {
      production: {
        files: {
          "public/js/output.js": ["src/client_js/*.js"]
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'src/less/*'],
      tasks: ['jshint', 'less']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['jshint', 'less']);

};
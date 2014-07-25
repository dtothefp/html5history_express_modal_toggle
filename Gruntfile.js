module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig( {
    pkg: grunt.file.readJSON('package.json'),

    express: {
      dev: {
        options: {
          //background: false,
          script: './app.js'
        }
      }
    },
    
    sass: {
      dist: {                           
        files: {
          './public/css/main.css': './public/css/*.scss'
        }
      }
    },

    watch: {
      sass: {
        files: ['./public/css/*.scss'],
        tasks: ['sass']
      }
    }

  } );

  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask( 'default', [ 'sass', 'express:dev', 'watch' ] );
};

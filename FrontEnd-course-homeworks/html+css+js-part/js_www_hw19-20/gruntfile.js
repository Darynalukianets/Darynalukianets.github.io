module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/*.js'],
        dest: 'js/dist/script.main.js'
      }
    },
    uglify: {
      dist: {
        src: ['js/dist/script.main.js'],
        dest: 'js/dist/script.main.min.js'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'styles/css/dist/style.min.css': ['styles/css/*.css']
        }
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'styles/scss',
          src: ['*.scss'],
          dest: 'styles/css',
          ext: '.css'
        }]
      }
    },
    watch: {
      sass: {
        files: ['styles/scss/*.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass','cssmin', 'concat', 'uglify']);
  // grunt.registerTask('default', ['sass','concat', 'uglify', 'cssmin']);

};

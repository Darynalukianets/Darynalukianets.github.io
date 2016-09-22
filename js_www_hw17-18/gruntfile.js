module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/*.js'],
        dest: 'js/script.main.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);

};

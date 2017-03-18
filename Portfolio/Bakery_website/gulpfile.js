'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cleanCss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps');
    // imagemin = require('gulp-imagemin'),
    // pngquant = require('imagemin-pngquant'),
    // rimraf = require('rimraf'),
    // browserSync = require("browser-sync"),
    // spritesmith = require('gulp.spritesmith'),
    // reload = browserSync.reload;

    var path = {
        build: {
            html: 'dist/',
            js: 'dist/js/',
            css: 'dist/css/',
            img: 'dist/img/'
        },
        src: {
            html: 'src/*.html',
            js: 'src/js/partials/*.js',
            style: 'src/style/main.scss',
            // style: ['src/style/main.scss', 'src/style/scss/ie8.scss' ], вариант на случай ie8
            img: 'src/img/*.*',
            sprite: 'src/img/sprite/*.png'
          },

        watch: {
          html: 'src/**/*.html',
          js: 'src/js/partials/*.js',
          style: 'src/style/scss/**/*.scss',
          img: 'src/img/**/*.*',
          sprite: 'src/img/sprite/*.*'
        },
        clean: './dist'
};

var config = {
  server: {
    baseDir: "./dist"
  },
  tunnel: true,
  host: 'localhost',
  port: 8000,
  logPrefix: "Test_task"
};

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
      });


gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function() {

  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourceMap: true,
      errLogToConsole: true
    }))
    .pipe(prefixer())
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
});

gulp.task('sprite', function () {
    var spriteData =
        gulp.src(path.src.sprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
                imgPath: '../img/sprite.png'
            }));

    spriteData.img.pipe(gulp.dest('dist/img'));
    return spriteData.css.pipe(gulp.dest('dist/css/'));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});


// рабочая версия
// gulp.task('build', [
//   'html:build',
//   'js:build',
//   'style:build',
//   'sprite',
//   'image:build'
// ]);

// Версия на время разработки
gulp.task('build', [
  'html:build',
  'style:build'
]);

gulp.task('watch', function() {
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.sprite], function(event, cb) {
    gulp.start('sprite:build');
  });
});

// gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('default', ['build']);

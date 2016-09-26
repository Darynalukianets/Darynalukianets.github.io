'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cleanCss = require('gulp-clean-css');

    var path = {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
            // html: 'build/',
            js: 'build/js/',
            jsMain: 'src/js/',
            css: 'build/css/',
            cssMain: 'src/css/'
        },
        src: { //Пути откуда брать исходники
            // html: 'src/*.html',
            js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
            jsParts: 'src/js/partials/*.js',
            css: 'src/css/main.css',
            cssParts: 'src/css/partials/*.css'
        }
    };

gulp.task('js:build', function (callback) {
    gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
        callback();
});

gulp.task('jsMain:build', function (callback) {
    return gulp.src(path.src.jsParts)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.build.jsMain));
        callback();
});

gulp.task('cssMain:build', function (callback) {
    return gulp.src(path.src.cssParts)
        .pipe(concatCss("main.css"))
        .pipe(gulp.dest(path.build.cssMain));
        callback();
});

gulp.task('css:build', function (callback) {
    return gulp.src(path.src.css)
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.build.css));
        callback();
});

gulp.task('build', gulp.series('jsMain:build', 'js:build', 'cssMain:build', 'css:build'));

gulp.task('default', gulp.series('build'));

'use strict';

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cssnext = require('postcss-cssnext'),
    cssmin = require('gulp-cssmin'),
    csscomb = require('gulp-csscomb'),
    postcss = require('gulp-postcss'),
    jscs = require('gulp-jscs'),
    uglify = require('gulp-uglify'),
    include = require('gulp-html-tag-include'),
    cssimport = require('postcss-import'),
    del = require('del'),
    postcsscomb = require('postcss-csscomb');

var paths = {
    css: 'static/css/',
    js: 'static/js/',
    img: 'static/img/',
    font: 'static/fonts/',
    html: {
        templates: 'static/templates/',
        index: ''
    },
    vendors: 'static/vendors/',
    build: 'build/'
}

var pluginspostcss = [cssimport({path: (paths.css + 'style.css'), root: paths.css}), cssnext()];

//Отслеживание изменений
gulp.task('watch', function() {
    gulp.watch('static/**/*.{js,postcss,html}', ['build']);

});

//Копирование файлов
gulp.task('copy', function () {
  return gulp
    .src(paths.img + '*')
    .pipe(gulp.dest(paths.build + 'img/'));
});

gulp.task('copyFile', function () {
  return gulp
    .src(paths.font + '*')
    .pipe(gulp.dest(paths.build + 'fonts/'));
});

gulp.task('rename', function() {
    return gulp.src(paths.css + '*.postcss')
    .pipe(rename({
                extname: '.css'
            }))
    .pipe(gulp.dest(paths.css));
});

gulp.task('rename', function() {
    return gulp.src(paths.css + '*.postcss')
    .pipe(rename({
                extname: '.css'
            }))
    .pipe(gulp.dest(paths.css));
});

gulp.task('delete', function() {
    return del(paths.css + '*.css');
});

//Cборка css
gulp.task('css', ['rename'], function () {
    return gulp.src(paths.css + 'style.css')
        .pipe(postcss(pluginspostcss))
        .pipe(csscomb())
        .pipe(gulp.dest(paths.build));
});

//Cборка js
gulp.task('js', function () {
    return gulp.src([paths.js + 'script.js'])
        .pipe(concat('script.js'))
        .pipe(jscs({fix: true}))
        .pipe(gulp.dest(paths.build));
});

//Сборка vendors js
gulp.task('vendorsjs', function () {
    return gulp.src(paths.vendors + '**/*.js')
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(paths.build));
});

//Сборка vendors css
gulp.task('vendorscss', function () {
    return gulp.src(paths.vendors + '**/*.css')
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest(paths.build));
});

//Шаблонизация
gulp.task('html', function() {
    return gulp.src(paths.html.templates + '*.html')
        .pipe(plumber({errorHandler: errorHandler}))
        .pipe(include())
        .pipe(gulp.dest(paths.build));
});

//Сборка проекта
gulp.task('build', ['copy', 'copyFile', 'html', 'css', 'js', 'vendorscss', 'vendorsjs'], function() {
    return gulp.src('')
        .pipe(notify({ message: 'Finished with build'}), del(paths.css + '*.css'));
});

//Минификация
gulp.task('uglify', function () {
    return gulp.src(paths.build + 'script.js')
        .pipe(uglify())
        .pipe(gulp.dest(paths.build));
});

gulp.task('cssmin', function () {
    return gulp.src(paths.build + 'style.css')
        .pipe(cssmin())
        .pipe(gulp.dest(paths.build));
});

gulp.task('minify', ['uglify', 'cssmin'], function() {
    return gulp.src('')
        .pipe(notify({ message: 'Finished with minification'}));
});

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var wrench = require('wrench');

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('dist', function () {
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
  });
  return gulp.src(options.src + '/app/index.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
    .pipe($.rename('angular-auth.js'))
    .pipe(gulp.dest(options.dist));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('build-dist', ['clean'], function () {
    gulp.start('dist');
});

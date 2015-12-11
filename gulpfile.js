var gulp = require('gulp');

var jshint = require('gulp-jshint')
 
gulp.task('syntax check', function () {
  return gulp.src('./server/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['syntax check']);
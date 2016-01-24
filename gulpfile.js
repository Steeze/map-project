var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

var gulpPlugins = gulpLoadPlugins({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('minify-javascript', function(){
   gulp.src('src/js/*.js')
       .pipe(minifyJavaScript())
       .pipe(gulpPlugins.concat('app.js'))
       .pipe(gulpPlugins.uglify())
       .pipe(gulp.dest('./dist/js'))
});


gulp.task('default', ['minify-javascript']);
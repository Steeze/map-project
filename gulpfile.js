var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var preprocess = require('gulp-preprocess');
var server = require('gulp-server-livereload');

var requiredJsFiles = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/knockout/build/output/knockout-latest.js',
    'node_modules/material-design-lite/dist/material.js',
    'node_modules/toastr/toastr.js',
    'node_modules/underscore/underscore.js',
    'src/js/view-model.js',
    'src/js/map-model.js',
    'src/js/brewery-model.js'
];

var requiredCssFile = [
    'node_modules/toastr/build/toastr.css',
    'src/css/map-project.css'
];

gulp.task('lint', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
    return gulp.src(requiredCssFile)
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('scripts', function() {
    return gulp.src(requiredJsFiles)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}}))
        .pipe(gulp.dest('dist/'))
});

gulp.task('open', function() {
    gulp.src('dist')
        .pipe(server({
            livereload: true,
            directoryListing: false,
            open: true,
            port:9999
        }));
});

gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
});

gulp.task('default', ['lint','html', 'css', 'scripts','open', 'watch']);


// grab our packages
var gulp   = require('gulp'),
    minifyHTML = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    preprocess = require('gulp-preprocess'),
    open = require('gulp-open'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('prod', ['html','concat', 'open']);

var requiredJsFiles = [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/knockout/build/output/knockout-latest.js',
        'node_modules/toastr/build/toastr.min.js',
        'node_modules/underscore/underscore.js',
        'src/js/view-model.js',
        'src/js/map-model.js',
        'src/js/brewery-model.js'
    ];


gulp.task('concat', function(){
    return gulp.src(requiredJsFiles)
        .pipe(concat('required.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function() {
    return gulp.src('src/css/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('open', function(){
    gulp.src('dist/index.html')
        .pipe(open());
});

gulp.task('html', function() {
    var opts = {
        conditionals: true,
        spare:true
    };
    gulp.src('src/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('dist/'))
});

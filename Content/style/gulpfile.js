var gulp = require('gulp');
var sass = require('gulp-sass');
//var minify_css = require('gulp-minify-css');
//var concat = require('gulp-concat');
//var rename = require('gulp-rename');
//var uglify = require('gulp-uglify');

var sass_dir = "SchedulingProg";
// var jsFiles = './scripts/**/*.js',
//     jsDest = 'dist/scripts';

gulp.task('sass', function () {
    var sass_process = gulp.src(sass_dir + '/*.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(minify_css())
        .pipe(gulp.dest(sass_dir));
    return sass_process;
});

// gulp.task('scripts', function() {
//     return gulp.src(jsFiles)
//         .pipe(concat('scripts.js'))
//         .pipe(gulp.dest(jsDest))
//         .pipe(rename('scripts.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest(jsDest));
// });

gulp.watch(sass_dir + '/*.scss', ['sass']);
//gulp.watch(jsFiles, ['scripts']);

//gulp.task('default', ['sass','scripts']);
gulp.task('default', ['sass']);
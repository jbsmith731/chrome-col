var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		autoprefixer 	= require('gulp-autoprefixer'),
		browserSync 	= require('browser-sync').create(),
		useref 				= require('gulp-useref'),
		uglify 				= require('gulp-uglify'),
		gulpif 				= require('gulp-if'),
		runSequence 	= require('run-sequence'),
		plumber				= require('gulp-plumber');

var onError = function (err) {
  console.log(err);
};


// Watch
// ---------------

gulp.task('sass', function(){
	return gulp.src('app/assets/scss/main.scss')
		.pipe(plumber({
      errorHandler: onError
    }))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
      browsers: ['last 2 versions', 'Firefox >= 3'],
      cascade: false
    }))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.stream());
})

gulp.task('browserSync', function(){
	 browserSync.init({
        server: "./app"
    });
})

gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('app/assets/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/assets/js/**/*.js', browserSync.reload);
})


// Build Prep
// ---------------

gulp.task('useref', function() {

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('dist'))
})

gulp.task('move', function() {
  return gulp.src(['app/assets/**', '!app/assets/{js,js/**}', '!app/assets/{scss,scss/**}'])
  .pipe(gulp.dest('dist/assets'))
})


// Build Sequences
// ---------------

gulp.task('build', function (callback) {
	runSequence(['sass', 'useref', 'move'],
		callback
	)
})

gulp.task('default', function (callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback
	)
})

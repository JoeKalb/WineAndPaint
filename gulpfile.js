var gulp = require('gulp'),
    livereload = require('gulp-livereload'),// auto-reload browser when files are changed 
    wiredep = require('wiredep').stream,
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),      // run a local dev server
    inject = require('gulp-inject'),    // inject app dependency includes on index.html
    nodemon = require('gulp-nodemon'),
    open = require('gulp-open');      // open a URL in the browser

var jsSources = ['app/*.js'],
    cssSources = ['app/**/*.css'],
    htmlSources = ['**/*.html'];


// Watch
gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(cssSources, ['css']);
    gulp.watch(htmlSources, ['html']);
});

var paths = ['./bower_components/','./app/*.js','./app/**/*.css'];


gulp.task('injectables', function() {
    var sources = gulp.src(paths, {read: false});
    return gulp.src('index.html')
        .pipe(wiredep())
        .pipe(inject(sources))
        .pipe(gulp.dest('.'));
});

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src(cssSources)
        .pipe(connect.reload())
});

gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true
    })
});

gulp.task('app', function(){
    var port = 8080;
    if (process.env.NODE_ENV === 'production') {
        port = process.env.PORT;
    }
    console.log("gulp port: " + port);
    var options = {
        uri: 'http://localhost:' + port,
        app: 'chrome'
    };
    gulp.src('./index.html')
        .pipe(open(options));
});

gulp.task('start', function () {
  nodemon({
    script: 'server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('serve', ['connect', 'watch', 'injectables', 'app']);

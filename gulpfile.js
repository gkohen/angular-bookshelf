'use strict';

// Require and load all dependent modules
//
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// js
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var gulpInject = require('gulp-inject');
var bowerFiles = require('main-bower-files');

// caching
var newer = require('gulp-newer');
var cached = require('gulp-cached');
var remember = require('gulp-remember');

// html
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');

// serving
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var gulpOpen = require('gulp-open');


//var gutil = require('gulp-util');
//var gulpif = require('gulp-if');
//var ngConstant = require('gulp-ng-constant');
//var ngFilesort = require('gulp-angular-filesort');
//var compass = require('gulp-compass');
//var minifyCSS = require('gulp-minify-css');
//var imagemin = require('gulp-imagemin');
//var flatten = require('gulp-flatten');
//var preprocess = require('gulp-preprocess');
//var protractor = require('gulp-protractor').protractor;
//var jshint = require('gulp-jshint');
//var extend = require('extend');


///////////////////////////////////////////////
///                 CONFIG                  ///
///////////////////////////////////////////////

// BASES AND PATHS
//
var bases = {
  app: 'app/',
  dist: 'dist/'
};

var app = {
  js: [
    bases.app + 'components/app.js',
    bases.app + 'components/**/*.js',
    //'!' + bases.app + 'components/**/*_test.js'
  ],
  cssAll: [bases.app + 'components/**/*.css'],
  index: bases.app + 'index.html',
  images: bases.app + 'components/**/*.{png,jpg,jpeg,gif,svg,ico}',
  templates: bases.app + 'components/**/*.html',
  statics: ['app/.htaccess', 'app/favicon.ico', 'app/robots.txt']
};

var dist = {
  js: bases.dist + 'js/',
  jsFiles: ['js/vendor.js', 'js/templates.js', 'js/scripts.js'],
  css: bases.dist + 'css/',
  images: bases.dist + 'images/'
};


// SERVING CONFIG
//
var port = 8000;


///////////////////////////////////////////////
///              GENERATE DIST              ///
///////////////////////////////////////////////

// CONCAT ALL APPLICATION SPECIFIC SCRIPTS
// 
gulp.task('scripts', function () {
  var scriptsFile = 'scripts.js';

  return gulp.src(app.js)
    .pipe(sourcemaps.init())
    .pipe(cached('scriptsCache'))
    //.pipe(plumber())
    //.on('error', gutil.log)
    .pipe(ngAnnotate())
    //.pipe(ngFilesort())
    .pipe(remember('scriptsCache'))
    .pipe(concat(scriptsFile))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.js));
});

// CONCAT ALL EXTERNAL SCRIPTS
// 
gulp.task('vendorScripts', function () {
  var vendorFile = 'vendor.js';

  return gulp.src(bowerFiles({
    filter: /\.js$/i
  }))
    .pipe(sourcemaps.init())
    .pipe(newer(dist.js + vendorFile))
    .pipe(concat(vendorFile))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.js));
});

// CONCAT ALL HTML FILES
//
gulp.task('templates', function () {
  var partialsFile = 'templates.js';

  return gulp.src(app.templates)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(ngHtml2Js({
      moduleName: 'templates',
      prefix: ''
    }))
    .pipe(newer(dist.js + partialsFile))
    .pipe(concat(partialsFile))
    .pipe(uglify())
    .pipe(gulp.dest(dist.js));
});

// INJECT FILES IN INDEX
//
gulp.task('injectIndex', ['scripts', 'vendorScripts', 'templates'], function () {
  var destinationDir = bases.dist;
  var srcOptions = {
    cwd: destinationDir,
    read: false
  };

  // use relative paths with dist as base; remove the prepended '../dist' in the path
  var injectOptions = {
    relative: true,
    ignorePath: '../' + destinationDir
  };
  return gulp.src(app.index)
    //.pipe(gulpInject(gulp.src(['css/vendor.css', 'css/style.css'], srcOptions), injectOptions))
    .pipe(gulpInject(gulp.src(dist.jsFiles, srcOptions), injectOptions))
    .pipe(gulp.dest(destinationDir));
});


///////////////////////////////////////////////
///                SERVE APP                ///
///////////////////////////////////////////////

// START A LOCAL SERVER
//
gulp.task('connect', ['build'], function () {
  connect.server({
    root: ['dist'],
    port: port,
    livereload: true,
    middleware: function () {
      return [historyApiFallback];
    }
  });
});

// OPEN THE PAGE IN A WEBBROWSER
//
gulp.task('open', ['connect'], function () {
  var options = {
    url: 'http://localhost:' + port
  };
  gulp.src('dist/index.html')
    .pipe(gulpOpen('', options));
});

// RELOAD THE PAGE
//
gulp.task('reload', function () {
  return gulp.src(bases.dist)
    .pipe(connect.reload());
});

// WATCH FOR CHANGES TO RELOAD PAGE
//
gulp.task('watch', ['build'], function () {
  gulp.watch(app.templates, ['templates']);
  gulp.watch(app.images, ['images']);
  gulp.watch(app.cssAll, ['styles']);
  gulp.watch(app.js, ['scripts']);
  // watch any change in dist folder; reload immediately in case of detected change
  gulp.watch(bases.dist + '**', ['reload']);
});

///////////////////////////////////////////////
///                TEST APP                 ///
///////////////////////////////////////////////


///////////////////////////////////////////////
///             TASKS FOR USER              ///
///////////////////////////////////////////////

// 'gulp build' create all files required for deploy
gulp.task('build', ['scripts', 'vendorScripts', 'templates', 'injectIndex']);

// 'gulp' start a local server
gulp.task('default', ['build', 'watch', 'connect', 'open']);
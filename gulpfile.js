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

// html
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');

// css
var minifyCSS = require('gulp-minify-css');

// caching
var newer = require('gulp-newer');
var cached = require('gulp-cached');
var remember = require('gulp-remember');

// serving
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var gulpOpen = require('gulp-open');

// unit testing
var karma = require('karma').server;

// e2e testing
var protractor = require('gulp-protractor').protractor;
var exit = require('gulp-exit');

//var gutil = require('gulp-util');
//var gulpif = require('gulp-if');
//var ngConstant = require('gulp-ng-constant');
//var ngFilesort = require('gulp-angular-filesort');
//var compass = require('gulp-compass');
//var imagemin = require('gulp-imagemin');
//var flatten = require('gulp-flatten');
//var preprocess = require('gulp-preprocess');
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
    '!' + bases.app + 'components/**/*_test.js'
  ],
  css: [bases.app + 'components/**/*.css'],
  index: bases.app + 'index.html',
  images: bases.app + 'components/**/*.{png,jpg,jpeg,gif,svg,ico}',
  templates: bases.app + 'components/**/*.html',
  statics: ['app/.htaccess', 'app/favicon.ico', 'app/robots.txt']
};

var dist = {
  js: bases.dist + 'js/',
  jsFiles: ['js/vendor.js', 'js/templates.js', 'js/scripts.js'],
  css: bases.dist + 'css/',
  cssFiles: ['css/vendor.css', 'css/style.css'],
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

// CONCAT ALL APPLICATION SPECIFIC STYLES
//
gulp.task('styles', function () {
  var stylesFile = 'style.css';

  return gulp.src(app.css)
    .pipe(sourcemaps.init())
    .pipe(newer(dist.css + stylesFile))
    .pipe(concat(stylesFile))
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.css));
});

// CONCAT ALL EXTERNAL STYLES
// 
gulp.task('vendorStyles', function () {
  var vendorFile = 'vendor.css';

  return gulp.src(bowerFiles({
    filter: /\.css$/i
  }))
    .pipe(sourcemaps.init())
    .pipe(newer(dist.css + vendorFile))
    .pipe(concat(vendorFile))
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.css));
});

// INJECT FILES IN INDEX
//
gulp.task('injectIndex', ['scripts', 'vendorScripts', 'styles', 'vendorStyles', 'templates'], function () {
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
    .pipe(gulpInject(gulp.src(dist.cssFiles, srcOptions), injectOptions))
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
  gulp.watch(app.css, ['styles']);
  gulp.watch(app.js, ['scripts']);
  // watch any change in dist folder; reload immediately in case of detected change
  gulp.watch(bases.dist + '**', ['reload']);
});

///////////////////////////////////////////////
///                TEST APP                 ///
///////////////////////////////////////////////

// Unit Test
//
// setup app for testing
gulp.task('karma:appSetup', ['templates', 'vendorScripts'], function (done) {
  done();
});
// run tests once
gulp.task('karma:singleRun', ['karma:appSetup'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  });
});
// run tests when files change
gulp.task('karma:watch', ['karma:appSetup'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    autoWatch: true
  }, function() {
    done();
  });
});
// run tests in multiple browsers
gulp.task('karma:all', ['karma:appSetup'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS', 'Firefox', 'Chrome'],
    singleRun: true
  }, function() {
    done();
  });
});

// e2e Test
//
// setup app for testing
gulp.task('protractor:appSetup', ['build', 'connect'], function (done) {
  done();
});
// run e2e tests once
gulp.task('protractor:singleRun', ['protractor:appSetup'], function (done) {
  gulp.src(['e2e/**/*.js'])
    .pipe(protractor({
      configFile: 'protractor.conf.js'
    })).on('error', function (e) {
      console.log(e);
      done();
    }).on('end', done);
});
// clean up after e2e tests
gulp.task('protractor:tearDown', ['protractor:singleRun'], function () {
  gulp.src(bases.dist)
    .pipe(connect.serverClose());
  gulp.src(bases.dist)
    .pipe(exit());
});

///////////////////////////////////////////////
///             TASKS FOR USER              ///
///////////////////////////////////////////////

// 'gulp build' create all files required for deploy
gulp.task('build', ['scripts', 'vendorScripts', 'templates', 'styles', 'vendorStyles', 'injectIndex']);

// 'gulp' start a local server
gulp.task('default', ['build', 'watch', 'connect', 'open']);

// 'gulp test' run unit tests once
gulp.task('test', ['karma:appSetup', 'karma:singleRun']);

// 'gulp test:all' run unit tests in multiple browsers
gulp.task('test:all', ['karma:appSetup', 'karma:all']);

// 'gulp test:watch' run unit tests every time a file changes
gulp.task('test:watch', ['karma:appSetup', 'karma:watch']);

// 'gulp e2e' run e2e tests once
gulp.task('e2e', ['protractor:appSetup', 'protractor:singleRun', 'protractor:tearDown']);
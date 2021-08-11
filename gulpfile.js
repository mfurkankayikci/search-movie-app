const { src, dest, watch, series, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const webserver = require('gulp-webserver');
const clean = require('gulp-clean');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const log = require('gulplog');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

function cleanDistFolder() {
  return src('./dist', { allowEmpty: true })
    .pipe(clean())
}

function buildStyles() {
  return src('./src/styles/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('./dist/css'));
}

function minifyJS() {
  return src('src/**/*.js', {read: false})
    .pipe(tap(function (file) {
      log.info('bundling ' + file.path);
      file.contents = browserify(file.path, {debug: true}).bundle();

    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist'));
}

function copyHTMLFiles() {
  return src('./src/pages/*.html')
    .pipe(dest('./dist/'));
}

function copyAssets() {
  return src('./src/assets/**/*')
    .pipe(dest('./dist/assets'));
}

function watchFiles() {
  watch('./src/pages/*.html', copyHTMLFiles);
  watch('./src/styles/*.scss', buildStyles);
  watch('./src/js/*.js', minifyJS);
}

function startWebServer() {
  return src('./dist')
    .pipe(webserver({
      port: 6639,
      livereload: true,
      open: true,
      fallback: './dist/index.html'
    }));
}

exports.clean = cleanDistFolder;
exports.buildStyles = buildStyles
exports.minifyJS = minifyJS;
exports.copyHTMLFiles = copyHTMLFiles;
exports.copyAssets = copyAssets;
exports.watchFiles = watchFiles;
exports.startWebServer = startWebServer;
exports.default = series(cleanDistFolder, buildStyles, minifyJS, copyAssets, copyHTMLFiles, parallel(watchFiles, startWebServer))
exports.build = series(cleanDistFolder, buildStyles, minifyJS, copyAssets, copyHTMLFiles)

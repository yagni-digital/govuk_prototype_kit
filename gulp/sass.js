/*
  sass.js
  ===========
  compiles sass from assets folder
  also includes sourcemaps
*/

const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const path = require('path')
const fs = require('fs')

const pluginDetection = require('../lib/plugin-detection')
const config = require('./config.json')

gulp.task('sass-plugins', function (done) {
  const fileContents = pluginDetection.getList('sassIncludes', pluginDetection.transform.scopeFilePathsToModule)
    .map(filePath => `@import "${filePath}";`)
    .join('\n')
  fs.writeFile(path.join(config.paths.assets, 'sass', 'allPluginIncludes-generated.scss'), fileContents, done)
})

gulp.task('sass', function () {
  return gulp.src(config.paths.assets + '/sass/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.paths.public + '/stylesheets/'))
})

gulp.task('sass-documentation', function () {
  return gulp.src(config.paths.docsAssets + '/sass/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.paths.public + '/stylesheets/'))
})

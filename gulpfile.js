'use strict';

const { src, dest, parallel, series, watch } = require('gulp');

const concat = require('gulp-concat');
const babel = require('gulp-babel');
const htmlMin = require('gulp-htmlmin');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const image = require('gulp-image');
const webp = require('gulp-webp');
const del = require('del');
const browserSync = require('browser-sync').create();

const path = {
  html: ['app/**/*.html'],
  css: ['app/css/**/*.css', '!app/css/*.map'],
  js: ['app/js/main.js'],
  fonts: ['app/fonts/**/*.{woff,woff2}'],
  images: ['app/images/**/*.{jpg,jpeg,png,gif}', '!app/images/icons/*', '!app/images/favicons/*'],
  sprite: ['app/images/sprite.svg'],
  favicons: ['app/images/favicons/**/*'],
  icons: ['app/images/icons/**/*'],
  static: ['app/browserconfig.xml', 'app/site.webmanifest', 'app/favicon.ico'],
  webpImg: ['app/images/**/*.{png,jpg,jpeg}', '!app/images/favicons/*', '!app/images/icons/*']
};

const clean = () => {
  return del([
    'dist'
  ]);
};

const copyFonts = () => {
  return src(path.fonts)
    .pipe(dest('dist/fonts'));
};

const copySprite = () => {
  return src(path.sprite)
    .pipe(dest('dist/images'));
};

const copyFiles = () => {
  return src([...path.favicons, ...path.icons], { base: 'app/images' })
    .pipe(dest('dist/images'));
};

const copyStaticFiles = () => {
  return src(path.static)
    .pipe(dest('dist'));
};

const htmlMinify = () => {
  return src(path.html)
    .pipe(htmlMin({
      collapseWhitespace: true  // передаём параметры, в данном случае удаление пробелов
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
};

const styles = () => {
  return src(path.css)
    .pipe(cleanCss({  // чистим файл css
      level: 2
    }))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
};

const images = () => {
  return src(path.images)
    .pipe(image())
    .pipe(dest('dist/images'));
};

const webConverter = () => {
  return src(path.webpImg)
    .pipe(webp())
    .pipe(dest('dist/images'));
};

const scripts = () => {
  return src(path.js, { allowEmpty: true })
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
};

watch(path.html, htmlMinify);
watch(path.css, styles);
watch(path.js, scripts);
watch(path.images, images);
watch(path.webpImg, webConverter);
watch(path.sprite, copySprite);

const copyAll = parallel(copyFonts, copyFiles, copyStaticFiles, copySprite);
exports.default = series(clean, copyAll, htmlMinify, styles, scripts, images, webConverter, watchFiles);

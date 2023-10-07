const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'dist/'
		}
	})
}

function cleanDist() {
	return del('dist')
}
function html() {
	return src(['src/*.html'])
		.pipe(dest('dist'))
		.pipe(browserSync.stream());
}

function images() {
	return src('src/img/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('dist/img'))
}

function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/aos/dist/aos.js',
		'node_modules/slick-carousel/slick/slick.js',
		'src/js/script.js'
	])
	.pipe(concat('script.min.js'))
	.pipe(uglify())
	.pipe(dest('dist/js'))
	.pipe(browserSync.stream())
}

function styles() {
	return src('src/scss/style.scss')
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: true
		}))
		.pipe(dest('dist/css'))
		.pipe(browserSync.stream())
}

function watching() {
	watch(['src/scss/**/*.scss'], styles).on('change', browserSync.reload);
	watch(['src/js/**/*.js', '!src/js/script.min.js'], scripts).on('change', browserSync.reload);
	watch(['src/*.html'], html).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.html = html;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, images, html, styles, scripts);
exports.default = parallel(styles, scripts, browsersync, watching);
// importamos gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var gulpImport = require("gulp-html-import");
var htmlmin = require('gulp-htmlmin');
var browserify = require('browserify');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var responsive = require('gulp-responsive');
var imagemin = require('gulp-imagemin');
var fontAwesome = require('node-font-awesome');

// source and distribution folder
var source = 'src/',
    dest = 'dist/';

// html config  
var html = {in : source + "*.html",
    out: dest,
    watch: [source + "*.html", source + "**/*.html"],
    sourcemaps: './'
};

// javascript config
var js = { in : source + "js/app.js",
    out: dest + "js/",
    watch: [source + "js/*.js", source + "js/**/*.js"],
    sourcemaps: './'
};

// bootstrap scss source and fonts
var bootstrapSass = { in : './node_modules/bootstrap-sass/' },
    fonts = {
        in : [
            fontAwesome.fonts,
            bootstrapSass.in + 'assets/fonts/**/*'
        ],
        out: dest + 'fonts/'
    };

// sass config
var scss = { in : source + 'scss/style.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sourcemaps: './',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets', fontAwesome.scssPath],
    }
};

// responsive config
var rwd = {
    in : [source + 'img/*', source + 'img/**/*'],
    out: dest + 'img/',
    watch: [source + 'img/*', source + 'img/**/*'],
    options: {
        "contents/*": [
            { width: 375, rename: { suffix: '-xs' }, withoutEnlargement:false, skipOnEnlargement: true },
            { width: 768, rename: { suffix: '-sm' }, withoutEnlargement:false, skipOnEnlargement: true },
            { width: 1024, rename: { suffix: '-md' }, withoutEnlargement:false, skipOnEnlargement: true },
            { width: 1200, rename: { suffix: '-lg' }, withoutEnlargement:false, skipOnEnlargement: true },
            { width: 1536, rename: { suffix: '-@2x' }, withoutEnlargement:false, skipOnEnlargement: true },
            { width: 2048, rename: { suffix: '-@3x' }, withoutEnlargement:false, skipOnEnlargement: true }
        ],
        "avatars/*": [
            { width: 35, height:35, withoutEnlargement:false, skipOnEnlargement: true },
            { width: 70, height:70, rename: { suffix: '@2x' }, withoutEnlargement:false, skipOnEnlargement: true },
            { width: 105, height:105, rename: { suffix: '@3x' }, withoutEnlargement:false, skipOnEnlargement: true },
        ]
    }
};

// images optimization
var img = {
    in : rwd.out + '*',
    out: rwd.out
};

gulp.task("html", function(){
    gulp.src(html.in)        
        .pipe(gulpImport('src/components/'))
        .pipe(htmlmin({collapseWhitespace: true})) // minifica el HTML
        .pipe(gulp.dest(html.out))
        .pipe(browserSync.stream())
        .pipe(notify("HTML importado"));
});

// copy bootstrap required fonts to dest
gulp.task('fonts', function() {
    gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out))
        .pipe(notify({
            title: "Fonts",
            message: "Fonts copiadas"
        }));
});

// compile scss
gulp.task('sass', function() {
    return gulp.src(scss.in)
        .pipe(sass(scss.sassOpts).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(scss.out))
        .pipe(notify({
            title: "SASS",
            message: "Compilado"
        }))
        .pipe(browserSync.stream());
});

// javascript
gulp.task("js", function() {
    gulp.src(js.in)
        .pipe(sourcemaps.init())
        .pipe(tap(function(file) {
            file.contents = browserify(file.path).bundle();
        }))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.write(js.sourcemaps))
        .pipe(gulp.dest(js.out))
        .pipe(notify({
            title: "JS",
            message: "Concatenado"
        }))
        .pipe(browserSync.stream());
});

// responsive
gulp.task('responsive', function() {
    gulp.src(rwd.in)
        .pipe(responsive(rwd.options))
        .pipe(imagemin())
        .pipe(gulp.dest(rwd.out));
});

// image optimization
gulp.task('imagemin', function() {
    gulp.src(img.in)
        .pipe(imagemin())
        .pipe(gulp.dest(img.out));
});

// default task
gulp.task("default", ["js", "html", "sass", "fonts", "responsive", "imagemin"], function() {

    // iniciar BrowserSync
    browserSync.init({
        proxy: "http://127.0.0.1:3100/"
    });

    gulp.watch(scss.watch, ["sass"]);

    gulp.watch(html.watch, ["html"]);

    gulp.watch(js.watch, ["js"]);

    gulp.watch(rwd.watch, ["responsive", "imagemin"]);

});

/**
 * This gulpfile will copy static libraries and a index.html file as well as
 * merge, babelify and uglify the rest of the javascript project.
 *
 * TODO:
 * - Separate media, libs and src with different watchers.
 * - Media and libs should only be copied to dist if they are different sizes.
 *
 * The expected project is to be laid out as such:
 *
 * ├─┬ src
 * │ ├─┬ libs
 * │ │ ├── tween.min.js
 * │ │ ├── pixi.min.js
 * │ │ └── jquery.min.js
 * │ ├─┬ media
 * │ │ ├── audofile1.wav
 * │ │ └── picture1.png
 * │ ├─┬ subfolder
 * │ │ └── class1.js
 * │ ├── main.js
 * │ └── index.html
 * └── gulpfile.js
 */

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var assign = require('lodash.assign');
var browserSync = require('browser-sync');
var del = require('del');

var customOpts = {
    entries: ['./src/main.js'],
    debug: true,
    // transform: [['babelify', { ignore: ["./src/libs/**"] }]],
    ignore: ['./src/libs/**']
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).transform('babelify', {presets: ['es2016', 'stage-0']}));

b.on('log', gutil.log);

/**
 * This task removes all files inside the 'dist' directory.
 */
gulp.task('clean', function()
{
    del.sync('./build/**/*');
});

/**
 * This task will copy all files from libs into 'dist/libs'.
 * If you want to process them, just add your code to this task.
 */
gulp.task('libs', ['clean'], function()
{
    return gulp.src(['./src/libs/**'])
        .pipe(plumber())
        .pipe(gulp.dest('./build/libs'))
});

/**
 * This task will copy all files from media into 'dist/media'.
 * If you want to process them, just add your code to this task.
 */
gulp.task('assets', ['libs'], function()
{
    return gulp.src(['./src/assets/**'])
        .pipe(plumber())
        .pipe(gulp.dest('./build/assets'));
});

/**
 * This task will copy index.html into 'dist'.
 * If you want to process it, just add your code to this task.
 */
gulp.task('index', ['assets'], function()
{
    return gulp.src(['./src/index.html'])
        .pipe(plumber())
        .pipe(gulp.dest('./build'));
});

/**
 * This task will bundle all other js files and babelify them.
 * If you want to add other processing to the main js files, add your code here.
 */
gulp.task('bundle', ['index'], function()
{
    return b.bundle()
        .on('error', function(err)
        {
            console.log(err.message);
            browserSync.notify(err.message, 3000);
            this.emit('end');
        })
        .pipe(plumber())
        .pipe(source('build.js'))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'));
});

/**
 * This task starts watching the files inside 'src'. If a file is changed,
 * removed or added then it will run refresh task which will run the bundle task
 * and then refresh the page.
 *
 * For large projects, it may be beneficial to separate copying of libs and
 * media from bundling the source. This is especially true if you have large
 * amounts of media.
 */
gulp.task('watch', ['bundle'], function()
{
    var watcher = gulp.watch('./src/**/*', ['refresh']);
    watcher.on('change', function(event)
    {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/**
 * This task starts browserSync. Allowing refreshes to be called from the gulp
 * bundle task.
 */
gulp.task('browser-sync', ['watch'], function()
{
    return browserSync({ server:  { baseDir: './build' } });
});

/**
 * This is the default task which chains the rest.
 */
gulp.task('default', ['browser-sync']);

/**
 * Using a dependency ensures that the bundle task is finished before reloading.
 */
gulp.task('refresh', ['bundle'], browserSync.reload);

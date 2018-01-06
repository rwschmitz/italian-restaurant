// -------------------------------------
//   Task: js
// -------------------------------------
//
// - cache files for `watch`
// - add sourcemaps back to original JS files for error debugging
// - create minifed and compressed version of file (no more sourcemaps)
// - move files to /dist/
//
// -------------------------------------

import browserSync from 'browser-sync';
import gulp from 'gulp';
import cache from 'gulp-cached';
import buffer from 'gulp-buffer';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import globs from '../globs';

const jsTask = () => {
    return gulp.src(globs.to.js)
        .pipe(cache('js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: globs.to.src
        }))
        .pipe(gulp.dest(globs.to.dist))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(globs.to.dist))
        .pipe(browserSync.stream({ once: true }))
        .pipe(notify({ message: 'js task complete', onLast: true }));
};
jsTask.description = 'bundle js, add source maps, create .min file';

export default jsTask;

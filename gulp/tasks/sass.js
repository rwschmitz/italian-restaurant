'use strict';

import gulp from 'gulp';
import globs from '../globs';

const sassLint = require('gulp-sass-lint');

const sassTask = () => {
 
//gulp.task('default', function () {
  return gulp.src(globs.to.scss)
    .pipe(sassLint({
      rules: {
        "leading-zero": 0
      },
      configFile: '../../.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
//});

}

export default sassTask;
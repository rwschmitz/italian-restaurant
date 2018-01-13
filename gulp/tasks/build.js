// -------------------------------------
//   Task: build
// -------------------------------------
//
// - builds a complete project
// - clean /dist/ first
// - inline CSS and JS after full build
//
// -------------------------------------

import gulp from 'gulp';
import cleanTask from './clean';
import cssTask from './css';
import sassTask from './sass';
import htmlTask from './html';
import jsTask from './js';
import mustacheTask from './mustache';
import staticTask from './static';

const buildTask = (cb) => {
    return gulp.series(
        cleanTask,
        gulp.parallel(cssTask, sassTask, htmlTask, mustacheTask, jsTask, staticTask)
    )(cb);
};
buildTask.description = 'clean and build a new project';

export default buildTask;

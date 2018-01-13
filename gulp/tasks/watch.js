// -------------------------------------
//   Task: watch
// -------------------------------------
//
// - Browsersync will manage refresh and device sync
// - Browsersync uses /dist/ as base for the server
// - listen for changes in /src/ and run tasks
//
// -------------------------------------

import browserSync from 'browser-sync';
import gulp from 'gulp';
import notify from 'gulp-notify';
import sftp from 'gulp-sftp';
import gutil from 'gulp-util';
import cssTask from './css';
import sassTask from './sass';
import htmlTask from './html';
import jsTask from './js';
import mustacheTask from './mustache';
import staticTask from './static';
import config from '../config';
import globs from '../globs';

const serverInitTask = (cb) => {
    browserSync.init({
        files: [
            globs.to.html
        ],
        open: false,
        port: 9000,
        server: {
            baseDir: [globs.to.serve]
        }
    }, cb);
};

const watchFilesTask = (cb) => {
    // Watch .html files
    gulp.watch(globs.to.watch.html, gulp.series(htmlTask, cssTask));

    // Watch .mustache files
    gulp.watch(globs.to.watch.mustache, gulp.series(mustacheTask, cssTask));

    // Watch .scss files
    gulp.watch(globs.to.watch.scss, gulp.series(sassTask, cssTask, htmlTask, mustacheTask));

    // Watch .js files
    gulp.watch(globs.to.watch.js, gulp.parallel(jsTask));

    // Watch misc files
    gulp.watch(globs.to.watch.static, gulp.parallel(staticTask));

    // rws -- Added this line to actually reload the browser
    gulp.watch(globs.to.dist).on('change', browserSync.reload);

    // Watch files for upload
    const options = {
        interval: 5000,
        debounceDelay: 5000
    };
    const watcher = gulp.watch(globs.to.watch.deploy, options, () => {
        cb(null);
    });

    if (config.gulpflow.isDeployFTP) {
        // const conn = ftp.create({
        //     host: process.env.FTP_HOST,
        //     user: process.env.FTP_USER,
        //     pass: process.env.FTP_PASS,
        //     maxConnections: 1000,
        //     parallel: 5,
        //     log: gutil.log
        // });
        watcher.on('change', (event) => {
            gutil.log(gutil.colors.red('change:'), gutil.colors.yellow(JSON.stringify(event)));
            return gulp.src(event, { base: globs.to.deployBase })
                .pipe(notify({ message: 'watch-ftp complete', onLast: true }));
        });
    }

    if (config.gulpflow.isDeploySFTP) {
        const conn = {
            host: process.env.SFTP_HOST,
            user: process.env.SFTP_USER,
            pass: process.env.SFTP_PASS,
            remotePath: process.env.SFTP_REMOTEPATH,
            key: {
                location: process.env.SFTP_KEYPATH
            }
        };
        watcher.on('change', (event) => {
            gutil.log(gutil.colors.red('change:'), gutil.colors.yellow(JSON.stringify(event)));
            return gulp.src(event, { base: globs.to.deployBase, buffer: false })
                .pipe(sftp(conn))
                .pipe(notify({ message: 'watch-sftp complete', onLast: true }));
        });
    }

    return cb(null);
};

const watchTask = (cb) => {
    let taskStream;
    taskStream = gulp.series(watchFilesTask);

    // BrowserSync and watch files based on config.js settings
    if (config.gulpflow.isBrowserSync) {
        taskStream = gulp.series(
            serverInitTask,
            watchFilesTask
        )(cb);
    }

    return taskStream;
};
watchTask.description = 'start Browsersync, listen for changes in /src/ and run tasks';

export default watchTask;

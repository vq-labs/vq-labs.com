'use strict';
require('dotenv').config();

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace-task');
const spawn = require('child_process').spawn;
const fileinclude = require('gulp-file-include');
const liveServer = require('gulp-live-server');
const runSequence = require('run-sequence');

const build = () => {
   gulp.src([ 'src/**/index.html' ])
    .pipe(replace({
        patterns: [
            {
                match: 'VQ_API_URL',
                replacement: process.env.API_URL
            },
            {
                match: 'VQ_WEB_ENV',
                replacement: process.env.ENV
            }
        ]
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'));

    gulp.src([ 'src/**/*.js' ])
    .pipe(replace({
        patterns: [
            {
                match: 'VQ_API_URL',
                replacement: process.env.API_URL
            },
            {
                match: 'VQ_WEB_ENV',
                replacement: process.env.ENV
            }
        ]
    }))
    .pipe(gulp.dest('public'));

  gulp.src([ 'src/**/*.css' ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('public'))

    gulp.src([ 'assets/**/*' ])
    .pipe(gulp.dest('public'))
};

gulp.task('run', function(cb) {
  if (process.env.ENV.toLowerCase() === 'production') {
        runSequence(
        'build',
        'runServer',
        cb
    );
  } else {
        runSequence(
        'build',
        'watch',
        'runServer',
        cb
    );
  }
});

gulp.task('runServer', function() {
    var server = liveServer.static('./public', process.env.PORT);
    server.start();
});

gulp.task('build', () => build());

gulp.task('watch', () => gulp.watch('./src/**/**',  [ 'build' ]));

gulp.task('deploy', [ 'build' ], function() {
    const args = [ './**', '--region', 'eu-central-1', '--bucket', 'vq-labs.com', '--gzip' ];
    const npm = spawn("s3-deploy", args, { cwd: './public' });

    npm.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
    });

    npm.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    npm.on('close', code => {
        console.log(code !== 0 ? 'error in build' : 0);
    });
});
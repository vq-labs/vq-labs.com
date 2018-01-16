'use strict';

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace-task');
const spawn = require('child_process').spawn;
const fileinclude = require('gulp-file-include');
const liveServer = require('gulp-live-server');
const runSequence = require('run-sequence');
const fs = require('fs');
const args = require('yargs').argv;

const generateConfig = () => {
  if (!args.config) {
    console.log("ERROR: Please provide a config file as an argument!")
  }

  if (!args.env) {
    console.log("ERROR: Please provide an environment as an argument!")
  }

  if(!fs.existsSync(__dirname + args.config)) {
    console.log("Config file was not found at ", __dirname + args.config);
    return null;
  } else {
   return fs.readFileSync(__dirname + args.config, "utf8");
  }
}

if (!generateConfig()) {
  return;
}

const config = JSON.parse(generateConfig());

const build = () => {

    gulp.src([ 'src/**/index.html' ])
    .pipe(replace({
        patterns: [
            {
                match: 'VQ_TENANT_API_URL',
                replacement: config[args.env.toUpperCase()]["VQ_LABS_COM"]["API_URL"]
            },
            {
                match: 'VQ_WEB_ENV',
                replacement: args.env
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
                match: 'VQ_TENANT_API_URL',
                replacement: config[args.env.toUpperCase()]["VQ_LABS_COM"]["API_URL"]
            },
            {
                match: 'VQ_WEB_ENV',
                replacement: args.env
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
    runSequence(
        'build',
        'watch',
        'runServer',
        cb
    );
});

gulp.task('runServer', function() {
    var server = liveServer.static('./public', config[args.env.toUpperCase()]["VQ_LABS_COM"]["PORT"]);
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
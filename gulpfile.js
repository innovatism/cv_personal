const gulp = require('gulp');
const path = require('path');
const exec = require('child_process').exec;
const s3 = require('gulp-s3');
const runSequence = require('run-sequence');
const gutil = require("gulp-util");
const fs = require('fs');

// Parse config.json
const config = require('./tasks/config');

require('./tasks/latex')(gulp);
require('./tasks/dist')(gulp, config);
require('./tasks/upload')(gulp, config);

//
// "Porcelain" tasks
//
gulp.task('default', () => {
  gutil.log('');
  gutil.log('O Hai! (￣^￣)ゞ');
  gutil.log('');
  gutil.log('👉  Run `gulp work` to recompile tex document to pdf as it changes');
  gutil.log('👉  Run `gulp publish` to pack, encrypt, and upload pdf');
  gutil.log('');
  gutil.log('Good hunting!');
  gutil.log('');
});

gulp.task('publish', (done) => {
  runSequence('compress', 'upload:s3', done);
});

gulp.task('work', () => {
  gulp.watch(config.texFilename, ['compile'], { read: false });
});

//
// "Plumbing" tasks
//
gulp.task('compress', ['dist:reset'], (done) => {
  const password = config.configFile.archive_password;

  if (password == undefined) {
    throw new gutil.PluginError({
      plugin: 'compress',
      message: gutil.log(gutil.colors.red('No password set in config.json for archive, aborting!'))
    });
  };

  gutil.log(`📦  Packing with password '${password}'`);

  exec(`zip --password ${password} ${config.archivePath} ${config.resumeFilename}`, (err, stdout, stderr) => {
    if (stderr) {
      gutil.log(gutil.colors.red(stderr));
    }

    if (err) {
      // Usually fails because it can't find the PDF file
      gutil.log(gutil.colors.yellow('⚠️  Did you forget to run pdflatex?'));
    }

    done(err);
  });
});

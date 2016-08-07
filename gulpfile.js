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

gulp.task('upload:s3', () => {
  const awsConfig = JSON.parse(fs.readFileSync('./aws_config.json'));
  const options = {
    headers: {
      'x-amz-storage-class': 'STANDARD_IA', // Cheaper zone for infrequent access
      'x-amz-acl': 'public-read' // Owner has full control, public is read
      // only: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
    }
  };

  gutil.log('🛰  Putting file on S3');
  return gulp.src(config.archivePath)
    .pipe(s3(awsConfig, options));
});

const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const s3 = require('gulp-s3');
const runSequence = require('run-sequence');
const gutil = require("gulp-util");
const shell = require("gulp-shell");

//
// Common configuration
//
const config = JSON.parse(fs.readFileSync('./config.json'));
const distDirname = 'dist';
const resumeFilename = config.resume_filename || 'resume.pdf';
const texFilename = path.parse(config.resume_filename).name + '.tex' || 'resume.tex';
const archiveFilename = config.archive_filename || 'resume.zip';
const archivePath = path.resolve(distDirname, archiveFilename);

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
  gulp.watch(texFilename, ['compile'], { read: false });
});

//
// "Plumbing" tasks
//
gulp.task('dist:reset', (done) => {
  // Task necessary because I can't use gulp.dest with the compress task, since
  // zip can't be streamed at/to
  runSequence('dist:del', 'dist:mk', done);
});

gulp.task('dist:del', () => {
  return del([distDirname]);
});

gulp.task('dist:mk', (done) => {
  return fs.mkdir(distDirname, done);
});

gulp.task('compress', ['dist:reset'], (done) => {
  const password = config.archive_password;

  if (password == undefined) {
    throw new gutil.PluginError({
      plugin: 'compress',
      message: gutil.log(gutil.colors.red('No password set in config.json for archive!'))
    });
  };

  exec(`zip --password ${password} ${archivePath} ${resumeFilename}`, (err, stdout, stderr) => {
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

  return gulp.src(archivePath)
    .pipe(s3(awsConfig, options));
});

gulp.task('compile', (done) => {
  gutil.log('🖨  Change detected, recompiling!');
  runSequence('latex2pdf', done);
});

gulp.task('latex2pdf', shell.task([
    'bash lib/pdf_all.sh'
]));

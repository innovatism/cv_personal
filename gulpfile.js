const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const path = require('path');
const exec = require('gulp-exec');

const distPath = 'dist';

gulp.task('default', () => {
  // place code for your default task here
});

gulp.task('reset:dist', () => {
  // Not the gulp way, but I don't want to screw around with pipes etc.
  del.sync(['dist']);
  fs.mkdirSync(distPath);
});

gulp.task('compress', ['reset:dist'], (done) => {
  const inputFile = 'pierre-yves_poujade.pdf';
  const password = 'redacted';
  const outputFile = 'coaxial-resume.zip';
  const archivePath = path.resolve(distPath, outputFile);

  return gulp.src(inputFile)
    .pipe(exec(`zip --password ${password} ${archivePath} ${inputFile}`))
});

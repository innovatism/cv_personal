const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const distPath = 'dist';

gulp.task('default', () => {
  console.log('Available tasks:');
  console.log('  `compress`: Pack resumé into an archive and password protect it');
  console.log('  `reset:dist`: Empty dist/');
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

  exec(`zip --password ${password} ${archivePath} ${inputFile}`, (err, stdout, stderr) => {
    if (stderr) {
      console.error(stderr);
    }

    if (err) {
      // Usually fails because it can't find the PDF file
      // TODO: Possible to make it a gulp output with timestamp etc?
      console.error('⚠️  Did you forget to run pdflatex?');
    }

    return done(err);
  });
});

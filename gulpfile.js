const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const s3 = require('gulp-s3');

// Common configuration
const distDirname = 'dist';
const resumeFilename = 'pierre-yves_poujade.pdf';
const archiveFilename = 'coaxial-resume.zip';
const archivePath = path.resolve(distDirname, archiveFilename);

gulp.task('default', () => {
  console.log('Available tasks:');
  console.log('  compress – Pack resumé into an archive and password protect it');
  console.log(`  reset:dist – Empty ${distDirname}${path.sep}`);
});

gulp.task('reset:dist', () => {
  // Not the gulp way, but I don't want to screw around with pipes etc.
  del.sync([distDirname]);
  fs.mkdirSync(distDirname);
});

gulp.task('compress', ['reset:dist'], (done) => {
  const inputFile = 'pierre-yves_poujade.pdf';
  const password = 'redacted';
  const outputFile = 'coaxial-resume.zip';
  const archivePath = path.resolve(distPath, outputFile);

  exec(`zip --password ${password} ${archivePath} ${resumeFilename}`, (err, stdout, stderr) => {
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

gulp.task('upload:s3', () => {
  const awsConfig = JSON.parse(fs.readFileSync('./aws_config.json'));
  const options = {
    headers: {
      'x-amz-storage-class': 'STANDARD_IA', // Cheaper zone for infrequent access
      'x-amz-acl': 'public-read' // Owner has full control, public is read only: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
    }
  };

  return gulp.src(archivePath)
    .pipe(s3(awsConfig, options));
});

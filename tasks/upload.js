const fs = require('fs');
const s3 = require('gulp-s3');
const gutil = require('gulp-util');

module.exports = (gulp, config) => {
  gulp.task('upload:s3', () => {
    const awsConfig = JSON.parse(fs.readFileSync('./aws_config.json'));
    const options = {
      headers: {
        'x-amz-storage-class': 'STANDARD_IA', // Cheaper class for infrequent access
        'x-amz-acl': 'public-read' // Owner has full control, public is read
        // only: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
      }
    };

    gutil.log('🛰  Putting file on S3');
    return gulp.src(config.archivePath)
    .pipe(s3(awsConfig, options));
  });
};

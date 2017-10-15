const awspublish = require('gulp-awspublish');
const fs = require('fs');
const gutil = require('gulp-util');

module.exports = (gulp, config) => {
  gulp.task('upload:s3', () => {
    const awsConfigFile = JSON.parse(fs.readFileSync('./aws_config.json'));
    const publisher = awspublish.create({
      region: awsConfigFile.region,
      accessKeyId: awsConfigFile.key,
      secretAccessKey: awsConfigFile.secret,
      params: {
        Bucket: awsConfigFile.bucket,
        // cheaper class for infrequent access
        StorageClass: 'STANDARD_IA',
      },
    });
    const headers = {
      'x-amz-acl': 'public-read', // Owner has full control, public is read
      // only: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
    };

    gutil.log('🛰  Putting file on S3');
    return gulp.src(config.archivePath)
      .pipe(publisher.publish(headers))
      .pipe(awspublish.reporter());
  });
};

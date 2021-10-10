const gulp = require('gulp');
const gutil = require("gulp-util");

// Parse config.json
const config = require('./tasks/config');

require('./tasks/latex')(gulp);
require('./tasks/dist')(gulp, config);
require('./tasks/upload')(gulp, config);
require('./tasks/pack')(gulp, config);

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

gulp.task('publish', gulp.series('compile', 'pack:zip', 'upload:s3'));

gulp.task('work', () => {
  gulp.watch(`${config.srcPath}/**/*.{tex,cls}`, { read: false }, gulp.series('compile'));
});

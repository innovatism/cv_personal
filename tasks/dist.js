const del = require('del');
const fs = require('fs');

module.exports = (gulp, config) => {
  gulp.task('dist:del', () => {
    return del([config.distDirname]);
  });

  gulp.task('dist:mk', (done) => {
    return fs.mkdir(config.distDirname, done);
  });

  // Task necessary because I can't use gulp.dest with the compress task, since
  // zip can't be streamed at/to.
  gulp.task('dist:reset', gulp.series('dist:del', 'dist:mk'));
};

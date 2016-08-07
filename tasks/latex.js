const shell = require("gulp-shell");
const gutil = require("gulp-util");
const runSequence = require('run-sequence');

module.exports = (gulp) => {
  gulp.task('compile', (done) => {
    gutil.log('🖨  Change detected, recompiling!');
    runSequence('latex2pdf', done);
  });

  gulp.task('latex2pdf', shell.task([
    'bash lib/pdf_all.sh'
  ]));
};

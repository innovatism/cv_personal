const gutil = require('gulp-util');
const exec = require('child_process').exec;

module.exports = (gulp, config) => {
  gulp.task('pack:zip', gulp.series('dist:reset', (done) => {
    const password = config.configFile.archive_password;

    if (password == undefined) {
      throw new gutil.PluginError({
        plugin: 'pack:zip',
        message: gutil.log(gutil.colors.red('No password set in config.json for archive, aborting!'))
      });
    };

    gutil.log(`📦  Packing with password '${password}'`);

    exec(`zip --junk-paths --password ${password} ${config.archivePath} ${config.resumePath}`, (err, stdout, stderr) => {
      if (stderr) {
        gutil.log(gutil.colors.red(stderr));
      }

      if (err) {
        // Usually fails because it can't find the PDF file
        gutil.log(gutil.colors.yellow('⚠️  Did you forget to run pdflatex?'));
      }

      done(err);
    });
  }));
};

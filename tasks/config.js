const fs = require('fs');
const path = require('path');
const configFile = JSON.parse(fs.readFileSync('./config.json'));

// Solves a cyclic dependency
const archiveFilename = configFile.archive_filename || 'resume.zip';

const constants = {
  configFile: configFile,
  distDirname: configFile.dist_dir,
  resumeFilename: configFile.resume_filename || 'resume.pdf',
  texFilename: path.parse(configFile.resume_filename).name + '.tex' || 'resume.tex',
  archiveFilename: archiveFilename,
  archivePath: path.resolve(configFile.dist_dir, archiveFilename)
};

module.exports = constants;

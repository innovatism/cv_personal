const fs = require('fs');
const path = require('path');
const configFile = JSON.parse(fs.readFileSync('./config.json'));

// Solves cyclic dependency issue
const texFilename = path.parse(configFile.resume_filename).name + '.tex';

const config = {
  configFile: configFile,
  distDirname: configFile.dist_dir,
  srcDirname: configFile.src_dir,
  resumeFilename: configFile.resume_filename,
  resumePath: path.resolve(configFile.src_dir, configFile.resume_filename),
  texFilename: texFilename,
  texPath: path.resolve(configFile.src_dir, texFilename),
  archiveFilename: configFile.archive_filename,
  archivePath: path.resolve(configFile.dist_dir, configFile.archive_filename)
};

module.exports = config;

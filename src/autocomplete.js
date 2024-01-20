const pathUtils = require('./path/pathUtils');
const ls = require('./commands/ls');

const commands = [
  'cat',
  'cd',
  'ls',
  'exit',
  'help'
];

const commandsWithArgs = [
  'cat',
  'cd',
  'ls',
];

const defaultDirs = ['.', '..'];

class AutoComplete {
  constructor(shell) {
    this.shell = shell;
    this.s3 = shell.s3;
  }

  async getAutoCompletePaths(path) {
    const joined = pathUtils.joinDirs({
      bucket: this.shell.bucket,
      dirs: this.shell.dirs,
      path
    });

    const newBucket = joined.bucket;
    const newDirs = joined.dirs;
    const newPath = joined.path;

    if (!newBucket) {
      const buckets = await this.s3.listBuckets();
      return [...defaultDirs, ...buckets];
    }

    const objects = await ls(this.s3, newBucket, newDirs);
    return [...defaultDirs, ...objects];
  }

  completeLine(line, callback) {
    const parts = line.trimLeft().split(/\s+/);

    // autocomplete the available commands
    if (parts.length <= 1) {
      const command = parts[0];
      const hits = commands.filter((path) => path.startsWith(command));
      callback(null, [hits.length ? hits : commands, command]);
      return;
    } 

    // no need to autocomplete commands that don't allow arguments
    const command = parts[0].trim();
    if (!commandsWithArgs.includes(command)) {
      callback(null, [[], line]);
      return;
    }

    const argument = parts.slice(-1)[0];

    this.getAutoCompletePaths(argument).then(paths => {
      const hits = paths
        .map(path => {
          const currDir = argument.split('/').slice(0, -1);
          return pathUtils.join(currDir, path);
        })
        .filter(path => path.startsWith(argument))
      callback(null, [hits.length ? hits : paths, argument]);
    });
  }
}

module.exports = AutoComplete;
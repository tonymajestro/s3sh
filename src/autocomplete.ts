import * as pathUtils from "./path/pathUtils";
import ls from "./commands/ls";
import S3Shell from "./shell";
import S3Helper from "./s3/s3Helper";

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

export default class AutoComplete {
  shell: S3Shell;
  s3Helper: S3Helper;

  constructor(shell: S3Shell) {
    this.shell = shell;
    this.s3Helper = shell.s3Helper;
  }

  async getAutoCompletePaths(newPath: string): Promise<string[]> {
    const { bucket, dirs, path } = pathUtils.resolvePath({
      bucket: this.shell.bucket,
      dirs: this.shell.dirs,
      path: newPath
    });

    if (!bucket) {
      const buckets = await this.s3Helper.listBuckets();
      return [...defaultDirs, ...buckets];
    }

    const objects = await ls(this.s3Helper, bucket, dirs);
    return [...defaultDirs, ...objects];
  }

  completeLine(line: string, callback) {
    const parts = line.trimStart().split(/\s+/);

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
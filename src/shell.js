const shell_ls = require('./commands/ls');
const shell_cd = require('./commands/cd');
const shell_cat = require('./commands/cat');
const pathUtils = require('./path/pathUtils');

class S3Shell {
  constructor(s3) {
    this.s3 = s3;
    this.bucket = '';
    this.dirs = [];
  }

  get prompt() {
    if (!this.bucket) {
      return '/$ ';
    }

    const path = pathUtils.join(this.bucket, this.dirs);
    return `/${path}/$ `;
  }

  async ls(args) {
    if (!args?.length) {
      // No path given, display contents of current bucket/directory
      return await shell_ls(this.s3, this.bucket, this.dirs);
    } 
    
    if (args.length === 1) {
      // One path given, display contents of that bucket/directory
      const { bucket, dirs } = pathUtils.joinDirs({
        bucket: this.bucket,
        dirs: this.dirs,
        path: args[0]
      });

      return await shell_ls(this.s3, bucket, dirs);
    }

      // Multiple paths given, display contents of each one
    const contents = await Promise.all(args.map(async arg => {
      const { bucket, dirs } = pathUtils.joinDirs({
        bucket: this.bucket,
        dirs: this.dirs,
        path: arg
      });

      const results = await shell_ls(this.s3, bucket, dirs);
      return { path: arg, results };
    }));

    return contents.map(content => {
      return `${content.path}:\n${contents.results.join('\n')}`;
    });
  }

  async cd(args) {
    let arg = args.length ? args[0].trim() : '';
    if (!arg) {
      this.bucket = '';
      this.dirs = [];
      return;
    } 

    arg = pathUtils.addRightSlash(arg);

    const { bucket, dirs } = pathUtils.joinDirs({
      bucket: this.bucket, 
      dirs: this.dirs,
      path: arg
    });

    try {
      const result = await shell_cd(this.s3, bucket, dirs);
      this.bucket = result.bucket;
      this.dirs = result.dirs;
    } catch (error) {
      console.error(error.message);
    }
  }

  async cat(args) {
    if (!args?.length) {
      throw new Error("cat: missing argument")
    }

    const contents = await Promise.all(args.map(async arg => {
      const { bucket, dirs, path } = pathUtils.joinDirs({
        bucket: this.bucket,
        dirs: this.dirs,
        path: arg
      });

      return await shell_cat(this.s3, bucket, dirs, path);
    }));

    return contents.join('\n');
  }
}

module.exports = S3Shell;
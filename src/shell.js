const shell_ls = require('./commands/ls');
const shell_cd = require('./commands/cd');
const shell_cat = require('./commands/cat');
const pathUtils = require('./utils/path');
const s3Utils = require('./utils/s3utils');

class S3Shell {
  constructor(client) {
    this.client = client;
    this.bucket = '';
    this.dirs = [];
  }

  get prompt() {
    if (!this.bucket) {
      return '/$ ';
    }

    const path = pathUtils.addSlash({
      path: pathUtils.join(this.bucket, this.dirs),
      initialSlash: true,
      trailingSlash: true
    });

    return `${path}$ `;
  }

  async listObjectsOrBuckets(path) {
    if (!path.trim()) {
      return await shell_ls(this.client, this.bucket, this.dirs);
    }

    if (!this.bucket) {
      return await s3Utils.listBuckets(this.client);
    }

    const { bucket, dirs } = pathUtils.joinDirs({
      bucket: this.bucket,
      dirs: this.dirs,
      path: path
    });

    if (this.bucket != bucket) {
      return await s3Utils.listBuckets(this.client);
    }

    if (dirs.length && !path.endsWith('/')) {
      dirs.pop();
    }

    return await shell_ls(this.client, bucket, dirs);
  }

  async ls(args) {
    if (!args?.length) {
      // No path given, display contents of current bucket/directory
      return await shell_ls(this.client, this.bucket, this.dirs);
    } 
    
    if (args.length === 1) {
      // One path given, display contents of that bucket/directory
      const { bucket, dirs } = pathUtils.joinDirs({
        bucket: this.bucket,
        dirs: this.dirs,
        path: args[0]
      });

      return await shell_ls(this.client, bucket, dirs);
    }

      // Multiple paths given, display contents of each one
    const contents = await Promise.all(args.map(async arg => {
      const { bucket, dirs } = pathUtils.joinDirs({
        bucket: this.bucket,
        dirs: this.dirs,
        path: arg
      });

      const results = await shell_ls(this.client, bucket, dirs);
      return { path: arg, results };
    }));

    return contents.map(content => {
      return `${content.path}:\n${contents.results.join('\n')}`;
    });
  }

  async cd(args) {
    const arg = args.length ? args[0].trim() : '';
    if (!arg) {
      this.bucket = '';
      this.dirs = [];
      return;
    } 

    const { bucket, dirs } = pathUtils.joinDirs({
      bucket: this.bucket, 
      dirs: this.dirs,
      path: arg
    });

    const { newBucket = bucket, newDirs = dirs } = await shell_cd(this.client, bucket, dirs);
    this.bucket = newBucket;
    this.dirs = newDirs;
  }

  async cat(args) {
    if (!args?.length) {
      throw new Error("cat: missing argument")
    }

    const contents = await Promise.all(args.map(async arg => {
      const { bucket, dirs } = pathUtils.joinDirs({
        bucket: this.bucket,
        dirs: this.dirs,
        path: arg
      });

      return await shell_cat(this.client, bucket, dirs, arg);
    }));

    return contents.join('\n');
  }
}

module.exports = S3Shell;
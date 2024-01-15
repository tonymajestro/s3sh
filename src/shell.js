const shell_ls = require('./commands/ls');
const shell_cd = require('./commands/cd');
const shell_cat = require('./commands/cat');
const pathUtils = require('./utils/path');

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

    const path = pathUtils.join({
      bucket: this.bucket,
      dirs: this.dirs,
      initialSlash: true,
      trailingSlash: true
    });
    return `${path}$ `;
  }

  async ls() {
    return await shell_ls(this.client, this.bucket, this.dirs);
  }

  async cd(arg) {
    const { bucket, dirs } = await shell_cd(this.client, this.bucket, this.dirs, arg);
    this.bucket = bucket;
    this.dirs = dirs;
  }

  async cat(arg) {
    return await shell_cat(this.client, this.bucket, this.dirs, arg);
  }
}

module.exports = S3Shell;
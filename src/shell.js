const shell_ls = require('./commands/ls');
const shell_cd = require('./commands/cd');
const { join } = require('./utils/path');

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

    const path = join(this.bucket, this.dirs, true, true);
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
}

module.exports = S3Shell;
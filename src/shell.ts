import lsCmd from "./commands/ls";
import cdCmd from "./commands/cd";
import catCmd from "./commands/cat";
import * as pathUtils from "./path/pathUtils";

export default class S3Shell {
  readonly s3Helper: any;
  bucket: string;
  dirs: string[];

  constructor(s3Helper) {
    this.s3Helper = s3Helper;
    this.bucket = '';
    this.dirs = [];
  }

  get prompt(): string {
    if (!this.bucket) {
      return '/$ ';
    }

    const path = pathUtils.join(this.bucket, this.dirs);
    return `/${path}/$ `;
  }

  async ls(args: string[]): Promise<string[]> {
    if (!args.length) {
      // No path given, display contents of current bucket/directory
      return await lsCmd(this.s3Helper, this.bucket, this.dirs);
    } 
    
    if (args.length === 1) {
      // One path given, display contents of that bucket/directory
      const { bucket, dirs } = pathUtils.resolvePath({
        bucket: this.bucket,
        dirs: this.dirs,
        path: args[0]
      });

      return await lsCmd(this.s3Helper, bucket, dirs);
    }

      // Multiple paths given, display contents of each one
    const contents = await Promise.all(args.map(async arg => {
      const { bucket, dirs } = pathUtils.resolvePath({
        bucket: this.bucket,
        dirs: this.dirs,
        path: arg
      });

      const results = await lsCmd(this.s3Helper, bucket, dirs);
      return { path: arg, results };
    }));

    return contents.map(content => {
      return `${content.path}:\n${content.results.join('\n')}`;
    });
  }

  async cd(args: string[]): Promise<void> {
    let arg = args.length ? args[0].trim() : '';
    if (!arg) {
      this.bucket = '';
      this.dirs = [];
      return;
    } 

    arg = pathUtils.addRightSlash(arg);

    const { bucket, dirs } = pathUtils.resolvePath({
      bucket: this.bucket, 
      dirs: this.dirs,
      path: arg
    });

    try {
      const result = await cdCmd(this.s3Helper, bucket, dirs);
      this.bucket = result.bucket;
      this.dirs = result.dirs;
    } catch (error) {
      console.error(error.message);
    }
  }

  async cat(args: string[]): Promise<string> {
    if (!args.length) {
      throw new Error("cat: missing argument")
    }

    const contents = await Promise.all(args.map(async arg => {
      const { bucket, dirs, path } = pathUtils.resolvePath({
        bucket: this.bucket,
        dirs: this.dirs,
        path: arg
      });

      return await catCmd(this.s3Helper, bucket, dirs, path);
    }));

    return contents.join('\n');
  }
}
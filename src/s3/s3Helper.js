const { 
  GetObjectCommand,
  ListObjectsV2Command, 
  ListBucketsCommand,
  HeadBucketCommand } = require("@aws-sdk/client-s3");
const pathUtils = require("../path/pathUtils");

class S3Helper {
  constructor(client) {
    this.client = client;
  }

  async getObjectContents(bucket, key) {
    const request = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });

    const response = await this.client.send(request);
    return await response.Body?.transformToString() ?? '';
  }

  async listBuckets() {
    const response = await this.client.send(new ListBucketsCommand({}));
    return response.Buckets.map(bucket => pathUtils.addRightSlash(bucket.Name));
  }

  async listObjects(bucket, prefix) {
    const request = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix
    });

    const response = await(this.client.send(request));
    return response.Contents?.map(obj => obj.Key) ?? [];
  }

  async listObjectsInDirectory(bucket, dirs) {
    const prefix = pathUtils.getPrefix(dirs);
    const objects = await this.listObjects(bucket, prefix);

    const filesAndDirs = new Set();
    objects.forEach(object => {
      const split = object.split('/');
      let fileOrDir = split[dirs.length];

      // Append / to directories
      if (dirs.length != split.length - 1) {
        fileOrDir = pathUtils.addRightSlash(fileOrDir);
      }

      filesAndDirs.add(fileOrDir);
    });

    return Array.from(filesAndDirs).sort();
  }

  async doesBucketExist(bucket) {
    const request = new HeadBucketCommand({ Bucket: bucket });
    try {
      await this.client.send(request);
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkCredentials() {
    try {
      await this.listBuckets();
      return true;
    } catch(error) {
      throw new Error(`Error during initialization: ${error}`);
    }
  };
}

module.exports = S3Helper;
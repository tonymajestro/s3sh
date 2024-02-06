import { 
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command, 
  ListBucketsCommand,
  HeadBucketCommand 
} from "@aws-sdk/client-s3";

import * as pathUtils from "../path/pathUtils";

export default class S3Helper {
  s3Client: S3Client;

  constructor(s3Client: S3Client) {
    this.s3Client = s3Client;
  }

  async getObjectContents(bucket: string, key: string): Promise<string> {
    const request = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });

    const response = await this.s3Client.send(request);
    return await response.Body?.transformToString() ?? '';
  }

  async listBuckets(): Promise<string[]> {
    const response = await this.s3Client.send(new ListBucketsCommand({}));
    return response.Buckets?.map(bucket => pathUtils.addRightSlash(bucket.Name!)) ?? [];
  }

  async listObjects(bucket: string, prefix?: string): Promise<string[]> {
    const request = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix
    });

    const response = await(this.s3Client.send(request));
    return response.Contents?.map(obj => obj.Key!) ?? [];
  }

  async listObjectsInDirectory(bucket: string, dirs: string[]): Promise<string[]> {
    const prefix = pathUtils.getPrefix(dirs);
    const objects = await this.listObjects(bucket, prefix);

    const filesAndDirs = new Set<string>();
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

  async doesBucketExist(bucket: string): Promise<boolean> {
    const request = new HeadBucketCommand({ Bucket: bucket });
    try {
      await this.s3Client.send(request);
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkCredentials(): Promise<boolean> {
    try {
      await this.listBuckets();
      return true;
    } catch(error) {
      throw new Error(`Error during initialization: ${error}`);
    }
  }
}
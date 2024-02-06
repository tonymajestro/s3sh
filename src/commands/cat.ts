import { S3ServiceException } from "@aws-sdk/client-s3";
import * as pathUtils from "../path/pathUtils";
import S3Helper from "../s3/s3Helper";

export default async function cat(s3Helper: S3Helper, bucket: string, dirs: string[], path: string): Promise<string> {
  if (!bucket) {
    if (await s3Helper.doesBucketExist(path)) {
      return `cat ${path}: is a bucket`;
    } else {
      return `cat ${path}: No such file or directory`;
    }
  }

  try {
    const key = pathUtils.join(dirs, path);
    return await s3Helper.getObjectContents(bucket, key);
  } catch (error) {
    
    if (error instanceof S3ServiceException) {
      const statusCode = error?.$metadata?.httpStatusCode;
      if (statusCode === 403) {
        return `cat ${path}: Permission denied`;
      } else if (statusCode === 404) {
        return `cat ${path}: No such file or directory`;
      } else {
        return `cat error: ${error.message}`;
      }
    } else {
        return `cat error: ${error}`;
    }
  }
}
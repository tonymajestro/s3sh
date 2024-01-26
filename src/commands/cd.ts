import * as pathUtils from "../path/pathUtils";
import S3Helper from "../s3/s3Helper";

export interface CdOutput {
  bucket: string;
  dirs: string[];
}

export default async function cd(s3Helper: S3Helper, bucket?: string, dirs?: string[]): Promise<CdOutput> {
  // cd with no args will reset the path back to root directory
  if (!bucket) {
    return { bucket: '', dirs: [] };
  } 
  
  // cd [bucket]
  if (bucket && !dirs?.length) {
    if (await s3Helper.doesBucketExist(bucket)) {
      return { bucket, dirs };
    } else {
      throw new Error(`cd: no such bucket: ${bucket}`);
    }
  } 
  
  // cd [path]
  const path = pathUtils.trimSlash(dirs.pop());
  const objects = await s3Helper.listObjectsInDirectory(bucket, dirs);
  if (objects.find(obj => pathUtils.trimSlash(obj) === path)) {
    const newDirs = [...dirs, path];
    return { bucket, dirs: newDirs };
  } else {
    const fullPath = pathUtils.join(bucket, dirs);
    throw new Error(`cd: no such directory: ${fullPath}`);
  }
}
import S3Helper from "../s3/s3Helper";

export default async function ls(s3Helper: S3Helper, bucket: string, dirs: string[]): Promise<string[]> {
  if (!bucket) {
    // In root directory, list all buckets
    const buckets = await s3Helper.listBuckets();
    return buckets.sort();
  } else {
    // List all objects in bucket/directory
    const objects = await s3Helper.listObjectsInDirectory(bucket, dirs);
    return objects.filter(object => object.trim() !== '');
  }
}
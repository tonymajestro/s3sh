const ls = async (s3, bucket, dirs) => {
  if (!bucket) {
    // In root directory, list all buckets
    const buckets = await s3.listBuckets();
    return buckets.sort();
  } else {
    // List all objects in bucket/directory
    const objects = await s3.listObjectsInDirectory(bucket, dirs);
    return objects.filter(object => object.trim() !== '');
  }
};

module.exports = ls;
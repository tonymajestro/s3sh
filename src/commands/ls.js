const { listBuckets, listObjectsInDirectory } = require('../utils/s3utils');

const ls = async (client, bucket, dirs) => {
  if (!bucket) {
    // In root directory, list all buckets
    const buckets = await listBuckets(client);
    return buckets.sort();
  } else {
    // List all objects in bucket/directory
    return await listObjectsInDirectory(client, bucket, dirs);
  }
};

module.exports = ls;
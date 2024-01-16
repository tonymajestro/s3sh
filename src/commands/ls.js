const { listBuckets, listObjectsInDirectory } = require('../utils/s3utils');
const { getPrefix } = require('../utils/path');

const ls = async (client, bucket, dirs) => {
  if (bucket) {
    // List all objects in bucket/directory
    const prefix = getPrefix(dirs);
    return await listObjectsInDirectory(client, bucket, dirs, prefix);
  } else {
    // In root directory, list all buckets
    const buckets = await listBuckets(client);
    return buckets.sort();
  }
};

module.exports = ls;
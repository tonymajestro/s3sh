const { listBuckets, listObjectsInDirectory } = require('../utils/s3utils');
const { getPrefix } = require('../utils/path');

const ls = async (client, bucket, dirs) => {
  if (bucket) {
    const prefix = getPrefix(dirs);
    return await listObjectsInDirectory(client, bucket, dirs, prefix);
  } else {
    const buckets = await listBuckets(client);
    return buckets.sort();
  }
};

module.exports = ls;
const { listBuckets, listObjectsInDirectory } = require('../utils/s3utils');
const { getPrefix } = require('../utils/path');

const ls = async (client, bucket, dirs) => {
  if (bucket) {
    const prefix = getPrefix(dirs);
    const paths = await listObjectsInDirectory(client, bucket, dirs, prefix);
    return paths.join('\n');
  } else {
    const buckets = await listBuckets(client);
    buckets.sort();
    return buckets.join('\n');
  }
};

module.exports = ls;
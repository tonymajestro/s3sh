const { listObjectsInDirectory, doesBucketExist } = require('../utils/s3utils');
const pathUtils = require('../utils/path')

const cd = async (client, bucket, dirs) => {
  // cd with no args will reset the path back to root directory
  if (!bucket) {
    return { bucket: '', dirs: [] };
  } 
  
  // cd [bucket]
  if (bucket && !dirs?.length) {
    if (await doesBucketExist(client, bucket)) {
      return { bucket, dirs };
    } else {
      console.log(`cd: no such bucket: ${bucket}`);
      return { bucket, dirs };
    }
  } 
  
  // cd [path]
  const path = pathUtils.trimSlash(dirs.pop());
  const objects = await listObjectsInDirectory(client, bucket, dirs);
  if (objects.find(obj => pathUtils.trimSlash(obj) === path)) {
    dirs.push(path);
    return { bucket, dirs };
  } else {
    const fullPath = pathUtils.join(bucket, dirs);
    console.log(`cd: no such directory: ${fullPath}`);
    return { bucket, dirs };
  }
}

module.exports = cd;
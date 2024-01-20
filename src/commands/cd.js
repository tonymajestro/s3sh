const pathUtils = require('../path/pathUtils')

const cd = async (s3, bucket, dirs) => {
  // cd with no args will reset the path back to root directory
  if (!bucket) {
    return { bucket: '', dirs: [] };
  } 
  
  // cd [bucket]
  if (bucket && !dirs?.length) {
    if (await s3.doesBucketExist(bucket)) {
      return { bucket, dirs, success: true };
    } else {
      throw new Error(`cd: no such bucket: ${bucket}`);
    }
  } 
  
  // cd [path]
  const path = pathUtils.trimSlash(dirs.pop());
  const objects = await s3.listObjectsInDirectory(bucket, dirs);
  if (objects.find(obj => pathUtils.trimSlash(obj) === path)) {
    const newDirs = [...dirs, path];
    return { bucket, dirs: newDirs, success: true };
  } else {
    const fullPath = pathUtils.join(bucket, dirs);
    throw new Error(`cd: no such directory: ${fullPath}`);
  }
}

module.exports = cd;
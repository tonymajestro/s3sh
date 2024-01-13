const { listObjectsInDirectory, doesBucketExist } = require('../utils/s3utils');
const { stripSlash, getPrefix } = require('../utils/path')

const cd = async (client, bucket, dirs, arg) => {
  const path = stripSlash(arg);

  // cd with no args will reset the path back to root directory
  if (!path) {
    return { bucket: '', dirs: [] };
  } 
  
  // cd .. goes back one directory
  if (path === '..') {
    if (dirs.length == 0) {
      return { bucket: '', dirs };
    } else {
      dirs.pop();
      return { bucket, dirs };
    }
  } 
  
  // cd [bucket]
  if (!bucket) {
    if (doesBucketExist(client, path)) {
      return { bucket: path, dirs };
    } else {
      console.log(`cd: no such bucket: ${path}`);
      return { bucket, dirs };
    }
  } 
  
  // cd [path]
  // currently only supports one directory level at a time
  const prefix = getPrefix(dirs);
  const objects = await listObjectsInDirectory(client, bucket, dirs, prefix);
  if (objects.find(obj => stripSlash(obj) === path)) {
    dirs.push(path);
    return { bucket, dirs };
  } else {
    console.log(`cd: no such directory: ${path}`)
    return { bucket, dirs };
  }
}

module.exports = cd;
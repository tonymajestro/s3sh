const pathUtils = require("../path/pathUtils"); 

const cat = async (s3Helper, bucket, dirs, path) => {
  if (!bucket) {
    if (await s3Helper.doesBucketExist(path)) {
      return `cat ${path}: is a bucket`;
    } else {
      return `cat ${path}: No such file or directory`;
    }
  }

  try {
    const key = pathUtils.join(dirs, path);
    return await s3Helper.getObjectContents(bucket, key);
  } catch (error) {
    const statusCode = error.$metadata?.$httpStatusCode ?? -1;
    if (statusCode === 403) {
      return `cat ${path}: Permission denied`;
    } else if (statusCode === 404) {
      return `cat ${path}: No such file or directory`;
    } else {
      return `cat error: ${error.message}`;
    }
  }
}

module.exports = cat;

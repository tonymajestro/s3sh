const pathUtils = require("../path/pathUtils"); 

const cat = async (s3, bucket, dirs, path) => {
  if (!bucket) {
    if (await s3.doesBucketExist(path)) {
      console.error(`cat ${path}: is a bucket`);
      return '';
    } else {
      console.error(`cat ${path}: No such file or directory`);
      return '';
    }
  }

  try {
    const key = pathUtils.join(dirs, path);
    return await s3.getObjectContents(bucket, key);
  } catch (error) {
    const statusCode = error.$metadata?.httpStatusCode ?? -1;
    if (statusCode === 403) {
      console.error(`cat ${path}: Permission denied`);
      return '';
    } else if (statusCode === 404) {
      console.error(`cat ${path}: No such file or directory`);
      return '';
    } else {
      console.log(`cat: error: ${error.message}`);
      return '';
    }
  }
}

module.exports = cat;

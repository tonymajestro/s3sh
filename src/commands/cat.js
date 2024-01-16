const { GetObjectCommand } = require("@aws-sdk/client-s3"); 
const { doesBucketExist } = require('../utils/s3utils');
const pathUtils = require("../utils/path"); 

const cat = async (client, bucket, dirs, file) => {
  const stripped = pathUtils.stripSlash(file);
  if (!bucket) {
    if (await doesBucketExist(client, stripped)) {
      console.error(`cd ${stripped}: is a bucket`);
      return '';
    } else {
      console.error(`cat ${stripped}: No such file or directory`);
      return '';
    }
  }

  const key = pathUtils.join({
    dirs,
    file
  });

  try {
    const request = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });

    const response = await client.send(request);
    return await response.Body?.transformToString() ?? '';
  } catch (error) {
    const statusCode = error.$metadata?.httpStatusCode ?? -1;
    if (statusCode === 403) {
      console.error(`cat ${stripped}: Permission denied`);
      return '';
    } else if (statusCode === 404) {
      console.error(`cat ${stripped}: No such file or directory`);
      return '';
    } else {
      console.log(`cat: Unexpected error: ${error}`);
      return '';
    }
  }
}

module.exports = cat;

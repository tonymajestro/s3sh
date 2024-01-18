const { GetObjectCommand } = require("@aws-sdk/client-s3"); 
const { doesBucketExist } = require('../utils/s3utils');
const pathUtils = require("../utils/path"); 

const cat = async (client, bucket, dirs) => {
  if (!bucket) {
    throw new Error("cat: missing argument")
  }

  if (bucket && !dirs?.length) {
    if (await doesBucketExist(client, bucket)) {
      console.error(`cat ${bucket}: is a bucket`);
      return '';
    } else {
      console.error(`cat ${bucket}: No such file or directory`);
      return '';
    }
  }

  try {
    const request = new GetObjectCommand({
      Bucket: bucket,
      Key: pathUtils.join('', dirs)
    });

    const response = await client.send(request);
    return await response.Body?.transformToString() ?? '';
  } catch (error) {
    const statusCode = error.$metadata?.httpStatusCode ?? -1;
    if (statusCode === 403) {
      console.error(`cat ${path}: Permission denied`);
      return '';
    } else if (statusCode === 404) {
      console.error(`cat ${path}: No such file or directory`);
      return '';
    } else {
      console.log(`cat: error: ${error}`);
      return '';
    }
  }
}

module.exports = cat;

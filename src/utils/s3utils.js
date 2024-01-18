const { 
  S3Client, 
  ListObjectsV2Command, 
  ListBucketsCommand,
  HeadBucketCommand } = require("@aws-sdk/client-s3");
const pathUtils = require("./path");

const createClient = (profile, region) => {
  return new S3Client({
    profile,
    region
  });
}

const listBuckets = async (client) => {
  const response = await client.send(new ListBucketsCommand({}));
  return response.Buckets.map(bucket => pathUtils.addRightSlash(bucket.Name));
}

const listObjects = async (client, bucket, prefix) => {
  const request = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix
  });

  const response = await(client.send(request));
  return response.Contents?.map(obj => obj.Key) ?? [];
}

const listObjectsInDirectory = async (client, bucket, dirs) => {
  const prefix = pathUtils.getPrefix(dirs);
  const objects = await listObjects(client, bucket, prefix);

  const filesAndDirs = new Set();
  objects.forEach(object => {
    const split = object.split('/');
    let fileOrDir = split[dirs.length];

    // Append / to directories
    if (dirs.length != split.length - 1) {
      fileOrDir = pathUtils.addRightSlash(fileOrDir);
    }

    filesAndDirs.add(fileOrDir);
  });

  return Array.from(filesAndDirs).sort();
}

const doesBucketExist = async (client, bucket) => {
  const request = new HeadBucketCommand({ Bucket: bucket });
  try {
    await client.send(request);
    return true;
  } catch (error) {
    return false;
  }
};

const checkCredentials = async (client) => {
  try {
    await listBuckets(client);
  } catch(error) {
    throw new Error(`Error during initialization: ${error}`);
  }
};


module.exports = {
  createClient,
  listBuckets,
  listObjects,
  listObjectsInDirectory,
  doesBucketExist,
  checkCredentials
};
import { expect, test } from 'vitest'
import { createMock } from "./mock";

test('Test getObjectContents', async () => {
  const getObjectResponse = {
    Body: {
      transformToString: () => new Promise((resolve, reject) => resolve('foo'))
    }
  };

  const s3Helper = createMock(getObjectResponse);
  const response = await s3Helper.getObjectContents('bucket', 'key');
  expect(response).toEqual('foo');
});

test('Test getObjectContents no content', async () => {
  const s3Helper = createMock({});
  const response = await s3Helper.getObjectContents('bucket', 'key');
  expect(response).toEqual('');
});

test('Test listBuckets', async () => {
  const listBucketsResponse = {
    Buckets: [
      { Name: 'foo'},
      { Name: 'bar'},
      { Name: 'foobar'},
    ]
  };

  const s3Helper = createMock(listBucketsResponse);
  const response = await s3Helper.listBuckets();
  expect(response).toEqual([
    'foo/',
    'bar/',
    'foobar/'
  ]);
});

test('Test listObjects', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo.js' },
      { Key: 'bar.js' },
      { Key: 'foo/bar.js' },
      { Key: 'foo/bar/foobar.js' },
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const response = await s3Helper.listObjects('bucket', '');
  expect(response).toEqual([
    'foo.js',
    'bar.js',
    'foo/bar.js',
    'foo/bar/foobar.js'
  ]);
});

test('Test listObjectsInDirectory', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo.js' },
      { Key: 'bar.js' }
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const response = await s3Helper.listObjectsInDirectory('bucket', '');
  expect(response).toEqual([
    'bar.js',
    'foo.js',
  ]);
});

test('Test listObjectsInDirectory nested', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo/foo.js' },
      { Key: 'foo/bar.js' }
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const response = await s3Helper.listObjectsInDirectory('bucket', ['foo']);
  expect(response).toEqual([
    'bar.js',
    'foo.js',
  ]);
});

test('Test listObjectsInDirectory nested again', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo/bar/foo.js' },
      { Key: 'foo/bar/bar.js' },
      { Key: 'foo/foo/foo.js' },
      { Key: 'foo/foo.js' },
      { Key: 'foo/foobar/foo/bar.js' },
      { Key: 'foo/foobar/foo/bar.js' },
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const response = await s3Helper.listObjectsInDirectory('bucket', ['foo']);
  expect(response).toEqual([
    'bar/',
    'foo.js',
    'foo/',
    'foobar/'
  ]);
});

test('Test does bucket exist', async () => {
  const headBucketResponse = {
    BucketLocationType: "LocationType",
    BucketLocationName: "LocationName",
    BucketRegion: "Region",
    AccessPointAlias: false
  };

  const s3Helper = createMock(headBucketResponse);
  const bucketExists = await s3Helper.doesBucketExist('bucket');
  expect(bucketExists).toBeTruthy();
});

test('Test bucket does not exist', async () => {
  const s3Helper = createMock(new Error("bucket not found"));
  const bucketExists = await s3Helper.doesBucketExist('bucket');
  expect(bucketExists).toBeFalsy();
});

test('Test check credentials', async () => {
  const listBucketsResponse = {
    Buckets: [
      { Name: 'foo'},
      { Name: 'bar'},
      { Name: 'foobar'},
    ]
  };

  const s3Helper = createMock(listBucketsResponse);
  const response = await s3Helper.checkCredentials();

  expect(response).toBeTruthy();
});

test('Test check credentials fails', () => {
  const s3Helper = createMock(new Error("cannot access buckets"));
  return expect(() => s3Helper.checkCredentials()).rejects.toThrow();
});
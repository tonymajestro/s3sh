const cat = require('../../src/commands/cat');
const { createMock, MockError } = require('../s3/mock');

test('Test cat with bucket', async () => {
  const headBucketResponse = {
    BucketLocationType: "LocationType",
    BucketLocationName: "LocationName",
    BucketRegion: "Region",
    AccessPointAlias: false
  };

  const s3Helper = createMock(headBucketResponse);
  const catResult = await cat(s3Helper, '', [], 'bucket');
  expect(catResult).toEqual('cat bucket: is a bucket');
});

test('Test cat with missing file', async () => {
  const s3Helper = createMock(new Error(""));
  const catResult = await cat(s3Helper, '', [], 'bucket');
  expect(catResult).toEqual('cat bucket: No such file or directory');
});

test('Test cat with valid file', async () => {
  const s3Contents = 'foo\nbar';
  const s3Response = {
    Body: {
      transformToString: () => Promise.resolve(s3Contents)
    }
  };

  const s3Helper = createMock(s3Response);
  const catResponse = await cat(s3Helper, 'bucket', [], 'file');
  expect(catResponse).toEqual('foo\nbar');
});

test('Test cat with permission denied', async () => {
  const s3Helper = createMock(new MockError("Access denied", 403));
  const catResponse = await cat(s3Helper, 'bucket', [], 'file');
  expect(catResponse).toEqual('cat file: Permission denied');
});

import { expect, test } from 'vitest'
import cat from "../../src/commands/cat";
import { createMock, MockS3Exception } from "../s3/mock";

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
  const s3Helper = createMock(new MockS3Exception("error", 404));
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
  const s3Helper = createMock(new MockS3Exception("Permission denied,", 403));
  const catResponse = await cat(s3Helper, 'bucket', [], 'file');
  expect(catResponse).toEqual('cat file: Permission denied');
});

test('Test cat with no file found', async () => {
  const s3Helper = createMock(new MockS3Exception("No file found", 404));
  const catResponse = await cat(s3Helper, 'bucket', [], 'file');
  expect(catResponse).toEqual('cat file: No such file or directory');
});

test('Test cat with generic error', async () => {
  const s3Helper = createMock(new MockS3Exception("Generic error", 500));
  const catResponse = await cat(s3Helper, 'bucket', [], 'file');
  expect(catResponse).toEqual('cat error: Generic error');
});
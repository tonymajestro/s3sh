import { expect, test } from "vitest";
import cd from "../../src/commands/cd";
import { createMock, MockS3Exception } from "../s3/mock";

test('Test cd with no args will reset back to root directory', async () => {
  const s3Helper = createMock({});
  const { bucket, dirs } = await cd(s3Helper, '', []);
  expect(bucket).toEqual("");
  expect(dirs).toEqual([]);
});

test('Test cd with bucket', async () => {
  const headBucketResponse = {
    BucketLocationType: "LocationType",
    BucketLocationName: "LocationName",
    BucketRegion: "Region",
    AccessPointAlias: false
  };

  const s3Helper = createMock(headBucketResponse);
  const { bucket, dirs } = await cd(s3Helper, "bucket", []);
  expect(bucket).toEqual("bucket");
  expect(dirs).toEqual([]);
});

test('Test cd with bucket part 2', async () => {
  const headBucketResponse = {
    BucketLocationType: "LocationType",
    BucketLocationName: "LocationName",
    BucketRegion: "Region",
    AccessPointAlias: false
  };

  const s3Helper = createMock(headBucketResponse);
  const { bucket, dirs } = await cd(s3Helper, "bucket", []);
  expect(bucket).toEqual("bucket");
  expect(dirs).toEqual([]);
});

test('Test cd with bucket not found', () => {
  const s3Helper = createMock(new MockS3Exception("Not found", 404));
  expect(cd(s3Helper, "bucket", [])).rejects.toThrow();
});

test('Test cd with directory', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo' },
      { Key: 'bar' }
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const { bucket, dirs } = await cd(s3Helper, "bucket", ["foo"]);
  expect(bucket).toEqual("bucket");
  expect(dirs).toEqual(["foo"]);
});

test('Test cd with directory and slash', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo' },
      { Key: 'bar' }
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const { bucket, dirs } = await cd(s3Helper, "bucket", ["foo/"]);
  expect(bucket).toEqual("bucket");
  expect(dirs).toEqual(["foo"]);
});

test('Test cd with directory and slash in directory name', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo/' },
      { Key: 'bar' }
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const { bucket, dirs } = await cd(s3Helper, "bucket", ["foo/"]);
  expect(bucket).toEqual("bucket");
  expect(dirs).toEqual(["foo"]);
});

test('Test cd with directory and slash in directory name', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo/' },
      { Key: 'bar' }
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  const { bucket, dirs } = await cd(s3Helper, "bucket", ["foo"]);
  expect(bucket).toEqual("bucket");
  expect(dirs).toEqual(["foo"]);
});

test('Test cd with directory not found', async () => {
  const listObjectsResponse = {
    Contents: [
      { Key: 'foo' },
      { Key: 'bar' }
    ]
  };

  const s3Helper = createMock(listObjectsResponse);
  expect(cd(s3Helper, "bucket", ["foobar"])).rejects.toThrow();
});
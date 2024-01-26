import { S3Client} from "@aws-sdk/client-s3";
import S3Helper from "../../src/s3/s3Helper";

export class MockS3Client extends S3Client {
  response: any;

  constructor(response) {
    super();
    this.response = response;
  }

  send(request) {
    if (this.response instanceof Error) {
      return Promise.reject(this.response);
    }

    return Promise.resolve(this.response);
  }
}

export class MockError extends Error {
  $metadata: any;

  constructor(message, statusCode) {
    super(message);
    this.$metadata = { $httpStatusCode: statusCode }
  }
}

export function createMock(response) {
  const client = new MockS3Client(response);
  return new S3Helper(client);
}

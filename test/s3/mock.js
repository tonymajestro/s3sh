const S3Helper = require('../../src/s3/s3Helper');

class MockS3Client {
  constructor(response) {
    this.response = response;
  }

  send(request) {
    if (this.response instanceof Error) {
      return Promise.reject(this.response);
    }

    return Promise.resolve(this.response);
  }
}

const createMock = (response) => {
  const client = new MockS3Client(response);
  return new S3Helper(client);
};

module.exports = createMock;
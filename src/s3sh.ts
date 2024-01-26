import S3Shell from "./shell";
import S3Helper from "./s3/s3Helper";
import AutoComplete from "./autocomplete";
import prompt from "./prompt";

import { S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import minimist = require('minimist')

export default function createShell(profile?: string, region?: string): S3Shell{
  let s3Helper: S3Helper;
  if (profile) {
    s3Helper = new S3Helper(new S3Client({
      region: region,
      credentials: fromIni({ profile })
    }));
  } else {
    s3Helper = new S3Helper(new S3Client({}));
  }

  return new S3Shell(s3Helper);
}

async function run() {
  const argv = minimist(process.argv.slice(2));
  const shell = createShell(argv.profile, argv.region);
  const autocomplete = new AutoComplete(shell);

  await shell.s3Helper.checkCredentials();
  await prompt(shell, autocomplete);
};

run();

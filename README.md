# s3sh
## NPM
https://www.npmjs.com/package/s3sh

## Description
An iteractive command line shell for navigating and manipulating files in AWS S3.

## Usage
By default, s3sh will use the credentials in your ~/.aws/ directory.


```bash
npx s3sh

/$ cd my-bucket-name
/$ ls
directory1/
directory2/
file.txt

/$ cd directory1
/directory1/$ ls
directory3/
file2.txt
file3.txt
```

You can also require s3sh and use it as a library:

```javascript
const s3sh = require('s3sh')
const shell = s3sh.createShell();

const run = async () => {
  console.log("Buckets:");
  const buckets = await shell.ls();
  console.log(buckets);

  const bucket = buckets[0];
  console.log(`cd into ${bucket}`);
  await shell.cd(bucket);

  console.log(`Directories in ${bucket}:`);
  const dirs = await shell.ls();
  dirs.forEach(dir => {
    console.log(dir);
  });
};

run();
```

## Tab completion
s3sh supports tab completion for available commands. It also supports autocompleting directory and folder names.

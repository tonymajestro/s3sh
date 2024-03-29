# s3sh
An iteractive command line shell for navigating and manipulating files in AWS S3.

## NPM
https://www.npmjs.com/package/s3sh

## Usage
By default, s3sh will use the credentials in your ~/.aws/ directory. You can also pass in an AWS profile name using the --profile flag:

```bash
npx s3sh
npx s3sh --profile [profileName]
```


## Examples
You can use s3sh as a command line utility:

```bash
npx s3sh

/$ cd my-bucket-name
/$ ls
directory1/
directory2/
file.html

/$ cat file.txt
<html>
<h1>Hello s3sh!</h1>
</html>

/$ cd directory1
/directory1/$ ls
directory3/
file2.txt
file3.txt

/directory1/$ cat file2.txt
Hello from s3sh!
```

You can also require s3sh and use it as a library:

```javascript
import createShell from "s3sh";

let shell = createShell();

// Can also create shell with AWS Profile:
shell = createShell("profileName");

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

  const dir = dirs[0];
  console.log(`Contents of in ${dir}:`);
  console.log(await shell.cat(dir));
};

run();
```

## Tab completion
s3sh supports tab completion for available commands. It also supports autocompleting directory and file names.

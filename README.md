# s3sh
## NPM
https://www.npmjs.com/package/s3sh

## Description
An iteractive command line shell for navigating and manipulating files in AWS S3.

## Usage
By default, s3sh will use the credentials in your ~/.aws/ directory.


```
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

## Tab completion
s3sh supports tab completion for available commands. It also supports autocompleting directory and folder names.
import readline = require("node:readline");
import AutoComplete from "./autocomplete";
import S3Shell from "./shell";

const helpText = `
  usage: npx s3sh
         npx s3sh --profile [profile] --region [region]

  Available commands:
    cat      - prints contents of a file
    cd       - changes buckets or directory. 'cd ..' will go back one directory
    ls       - prints files and directory names in current bucket/directory
    exit     - exits the s3sh shell
    help     - prints help text
`;

export default async function prompt(shell: S3Shell, autocomplete: AutoComplete) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '/$ ',
    completer: (line, callback) => autocomplete.completeLine(line, callback)
  });

  rl.prompt();

  rl.on('line', async (line: string) => {
    const parts = line.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    try {
      switch (command) {
        case 'ls':
          const paths = await shell.ls(args);
          paths.forEach(path => {
            console.log(path);
          });
          console.log();
          break;
        case 'cat':
          const content = await shell.cat(args);
          console.log(content);
          break;
        case 'cd':
          await shell.cd(args);
          rl.setPrompt(shell.prompt);
          break;
        case 'exit':
          rl.close()
          rl.removeAllListeners()
        case 'help':
          console.log(helpText);
        case '':
          break;
        default:
          console.log(`command not found: ${command}`);
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Unexpected error: ${error.message}`);
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    }

    rl.prompt();
  }).on('close', () => {
    console.log('');
    process.exit(0);
  }); 
}
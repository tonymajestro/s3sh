const readline = require('node:readline');
const autocomplete = require('./autocomplete');

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

const prompt = async (shell) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '/$ ',
    completer: autocomplete(shell)
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const parts = line.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    try {
      switch (command) {
        case 'ls':
          const paths = await shell.ls();
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
      console.error(`Unexpected error: ${error}`)
    }

    rl.prompt();
  }).on('close', () => {
    console.log('');
    process.exit(0);
  }); 
}

module.exports = prompt;
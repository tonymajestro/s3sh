const readline = require('node:readline');
const autocomplete = require('./autocomplete');

const prompt = async (shell) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '/$ ',
    completer: autocomplete(shell)
  });

  rl.prompt();

  // rl.write will write to current line
  // rl.line fetches the current line

  rl.on('line', async (line) => {
    const parts = line.split(' ');
    const command = parts[0];
    const arg = parts.length == 2 ? parts[1] : '';

    switch (command) {
      case 'ls':
        const output = await shell.ls();
        console.log(output);
        break;
      case 'cd':
        await shell.cd(arg);
        rl.setPrompt(shell.prompt);
        break;
      case '':
        break;
      default:
        console.log(`command not found: ${command}`);
        break;
    }

    rl.prompt();
  }).on('close', () => {
    console.log('');
    process.exit(0);
  }); 
}

module.exports = prompt;
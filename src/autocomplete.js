const commands = [
  'cat',
  'cd',
  'ls',
  'exit',
  'help'
];

const autocomplete = (shell) => {
  const wrapper = (line, callback) => {
    const parts = line.trimLeft().split(/\s+/);

    if (parts.length <= 1) {
      // autocomplete the available commands
      const command = parts[0];
      const hits = commands.filter((c) => c.startsWith(command));
      callback(null, [hits.length ? hits : commands, command]);
      return;
    } 

    const command = parts[0].trim();
    if (command === 'cd' || command === 'cat') {
      // autocomplete buckets or s3 objects
      shell.ls().then(paths => {
        const argument = parts.slice(-1)[0];
        const hits = paths.filter((c) => c.startsWith(argument));
        callback(null, [hits.length ? hits : paths, argument]);
      });
    } else {
      callback(null, [[], line]);
    }
  };

  return wrapper;
};

module.exports = autocomplete;
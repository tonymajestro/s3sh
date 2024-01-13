const readline = require('readline');

const commands = [
  'ls',
  'cd'
];

const autocomplete = (shell) => {
  const wrapper = (line, callback) => {
    const parts = line.split(/\s+/);

    if (parts.length <= 1) {
      // autocomplete the available commands
      const hits = commands.filter((c) => c.startsWith(line));
      callback(null, [hits.length ? hits : commands, line]);
    } else if (parts.length == 2 && parts[0].trim() === 'cd') {
      // autocomplete buckets or s3 objects
      shell.ls().then(paths => {
        const argument = parts[1];
        const hits = paths.filter((c) => c.startsWith(argument));
        callback(null, [hits.length ? hits : lsObjects, argument]);
      });
    } else {
      callback(null, [[], line]);
    }
  };

  return wrapper;
};

module.exports = autocomplete;
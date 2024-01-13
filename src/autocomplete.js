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
      shell.ls().then(output => {
        const lsObjects = output.split('\n');
        const currentPath = parts[1];
        const hits = lsObjects.filter((c) => c.startsWith(currentPath));
        callback(null, [hits.length ? hits : lsObjects, currentPath]);
      });
    } else {
      callback(null, [[], line]);
    }
  };

  return wrapper;
};

module.exports = autocomplete;
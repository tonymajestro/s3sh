const pathUtils = require('./utils/path');

const commands = [
  'cat',
  'cd',
  'ls',
  'exit',
  'help'
];

const commandsWithArgs = [
  'cat',
  'cd',
  'ls',
];

const autocomplete = (shell) => {
  const wrapper = (line, callback) => {
    const parts = line.trimLeft().split(/\s+/);

    if (parts.length <= 1) {
      // autocomplete the available commands
      const command = parts[0];
      const hits = commands.filter((path) => path.startsWith(command));
      callback(null, [hits.length ? hits : commands, command]);
      return;
    } 

    const command = parts[0].trim();
    if (!commandsWithArgs.includes(command)) {
      callback(null, [[], line]);
      return;
    }

    const argument = parts.slice(-1)[0];

    if (pathUtils.isAbsolutePath(argument)) {
      shell.ls('/').then(paths => {
        const hits = paths
          .map(path => pathUtils.addLeftSlash(path))
          .filter(path => path.startsWith(argument));
        callback(null, [hits.length ? hits : paths, argument]);
      });
      return;
    }

    shell.autocompletePath(argument).then(paths => {
      const hits = paths
        .map(path => {
          const currDir = argument.split('/').slice(0, -1);
          return pathUtils.join('', [...currDir, path]);
        })
        .filter(path => path.startsWith(argument))
      callback(null, [hits.length ? hits : paths, argument]);
    });
  };

  return wrapper;
};

module.exports = autocomplete;
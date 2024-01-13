const stripSlash = (path) => {
  if (!path) {
    return;
  } else if (path.endsWith('/')) {
    return path.substring(0, path.length - 1);
  } else {
    return path;
  }
};

const appendSlash = (path) => {
  if (!path) {
    return '/';
  } else if (path.endsWith('/')) {
    return path;
  } else {
    return path + '/';
  }
};

const getPrefix = (dirs) => {
  if (dirs.length == 0) {
    return '';
  }
  return `${dirs.join('/')}/`;
};

module.exports = {
  stripSlash,
  appendSlash,
  getPrefix
}
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
  return join('', dirs, false, true);
};

const join = (bucket, dirs, initialSlash = false, trailingSlash = false) => {
  let parts = [];

  if (bucket) {
    parts.push(bucket);
  }

  if (dirs) {
    parts = parts.concat(dirs);
  }

  let start = initialSlash ? '/' : '';
  let end = trailingSlash ? '/' : '';

  return `${start}${parts.join('/')}${end}`;
}

module.exports = {
  stripSlash,
  appendSlash,
  getPrefix,
  join
}
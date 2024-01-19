const trimSlash = (path) => {
  return trimLeftSlash(trimRightSlash(path));
};

const trimLeftSlash = path => {
  if (!path) {
    return path;
  } else if (path.startsWith('/')) {
    return path.substring(1);
  } else {
    return path;
  }
};

const trimRightSlash = path => {
  if (!path) {
    return;
  } else if (path.endsWith('/')) {
    return path.substring(0, path.length - 1);
  } else {
    return path;
  }
};

const addLeftSlash = path => {
  if (!path) {
    return '/';
  } else if (path.startsWith('/')) {
    return path;
  } else {
    return '/' + path;
  }
};

const addRightSlash = path => {
  if (!path) {
    return '/';
  } else if (path.endsWith('/')) {
    return path;
  } else {
    return path + '/';
  }
};

const addSlash = (args) => {
  const { path = '', initialSlash = '', trailingSlash = '' } = args;

  if (!path) {
    return '/';
  }

  let result = path;
  if (initialSlash) {
    result = '/' + result;
  }
  if (trailingSlash) {
    result += '/';
  }

  return result;
};

const getPrefix = (dirs) => {
  if (!dirs?.length) {
    return '';
  }

  return addRightSlash(dirs.join('/'));
};

const isAbsolutePath = (path) => {
  return path.trim().startsWith('/');
};

const joinDirs = (args) => {
  const { bucket = '', dirs = '', path = '' } = args;

  if (isAbsolutePath(path)) {
    // Path is absolute, ignore the existing bucket and directory
    const parts = trimSlash(path.trim()).split('/');

    if (!parts?.length) {
      return { 
        bucket: '', 
        dirs: [] 
      };
    } else {
      return { 
        bucket: parts[0], 
        dirs: parts.slice(1) 
      };
    }
  }
  // Path is relative, add it to existing bucket and directory
  const parts = [];
  if (bucket) {
    parts.push(bucket);
  }

  if (dirs) {
    dirs.forEach(dir => {
      parts.push(dir);
    });
  }

  if (path) {
    trimSlash(path.trim())
    .split('/')
    .forEach(pathPart => {
      if (pathPart === '..' && parts.length) {
        // If path contains '..', go back one directory when constructing path
        parts.pop();
      } else if (pathPart !== '.') {
        // Ignore '.', treat it as current directory
        parts.push(pathPart);
      }
    });
  }

  if (!parts?.length) {
    return { 
      bucket: '', 
      dirs: [] 
    };
  } else {
    return { 
      bucket: parts[0], 
      dirs: parts.slice(1) 
    };
  }
};

const join = (bucket, dirs) => {
  const parts = [];

  if (bucket) {
    parts.push(bucket);
  }

  if (dirs) {
    dirs.forEach(dir => {
      parts.push(dir);
    });
  }

  return parts.join('/');
};

module.exports = {
  trimSlash,
  trimLeftSlash,
  trimRightSlash,
  isAbsolutePath,
  addSlash,
  addLeftSlash,
  addRightSlash,
  getPrefix,
  joinDirs,
  join
}
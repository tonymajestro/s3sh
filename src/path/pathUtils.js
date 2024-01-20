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

const getPrefix = (dirs) => {
  if (!dirs?.length) {
    return '';
  }

  return addRightSlash(dirs.join('/'));
};

const isAbsolutePath = (path) => {
  return path.trim().startsWith('/');
};

const isRelativePath = (path) => {
  return !isAbsolutePath(path);
};

const joinDirs = (args) => {
  const { bucket = '', dirs = [], path = '' } = args;

  if (!path) {
    return {
      bucket,
      dirs,
      path
    };
  }

  const parts = [];

  if (isRelativePath(path)) {
    if (bucket) {
      parts.push(bucket);
    }

    if (dirs) {
      dirs.forEach(dir => {
        parts.push(dir);
      });
    }
  }

  trimSlash(path.trim())
    .split('/')
    .forEach(pathPart => {
      if (pathPart === '..' ) {
        // If path contains '..', go back one directory when constructing path
        if (parts?.length) {
          parts.pop();
        }
      } else if (pathPart !== '.') {
        // Ignore '.', treat it as current directory
        parts.push(pathPart);
      }
    });

  if (!parts.length) {
    return { 
      bucket: '', 
      dirs: [],
      path: ''
    };
  } 
  
  if (parts.length === 1) {
    if (path.endsWith('/')) {
      return {
        bucket: parts[0],
        dirs: [],
        path: ''
      };
    } else {
      return {
        bucket: '',
        dirs: [],
        path: parts[0]
      };
    }
  }

  if (path.endsWith('/')) {
    return {
      bucket: parts[0],
      dirs: parts.slice(1),
      path: ''
    };
  } else {
    return {
      bucket: parts[0],
      dirs: parts.slice(1, -1),
      path: parts.slice(-1)[0]
    };
  }
};

const join = (arg1, arg2, arg3) => {
  const addPart = (arg, parts) => {
    if (!arg) {
      return;
    }

    if (Array.isArray(arg)) {
      arg.forEach(part => {
        parts.push(part);
      });
    } else {
      parts.push(arg);
    }
  };

  const parts = [];
  addPart(arg1, parts);
  addPart(arg2, parts);
  addPart(arg3, parts);

  return parts.join('/');
};

module.exports = {
  trimSlash,
  trimLeftSlash,
  trimRightSlash,
  isAbsolutePath,
  isRelativePath,
  addLeftSlash,
  addRightSlash,
  getPrefix,
  joinDirs,
  join
}
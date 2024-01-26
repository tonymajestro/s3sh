export interface ResolvePathOptions {
  bucket?: string;
  dirs?: string[];
  path?: string;
};

export interface ResolvePathOutput {
  bucket: string;
  dirs: string[];
  path: string;
};

export function trimSlash(path: string): string {
  return trimLeftSlash(trimRightSlash(path));
}

export function trimLeftSlash(path: string) : string {
  if (!path) {
    return path;
  } else if (path.startsWith('/')) {
    return path.substring(1);
  } else {
    return path;
  }
}

export function trimRightSlash(path: string): string {
  if (!path) {
    return;
  } else if (path.endsWith('/')) {
    return path.substring(0, path.length - 1);
  } else {
    return path;
  }
}

export function addLeftSlash(path: string): string {
  if (!path) {
    return '/';
  } else if (path.startsWith('/')) {
    return path;
  } else {
    return '/' + path;
  }
}

export function addRightSlash(path: string): string {
  if (!path) {
    return '/';
  } else if (path.endsWith('/')) {
    return path;
  } else {
    return path + '/';
  }
}

export function getPrefix(dirs: string[]): string {
  if (!dirs?.length) {
    return '';
  }

  return addRightSlash(dirs.join('/'));
}

export function isAbsolutePath(path: string): boolean {
  return path.trim().startsWith('/');
};

export function isRelativePath(path: string): boolean {
  return !isAbsolutePath(path);
}

export function resolvePath(options: ResolvePathOptions): ResolvePathOutput {
  const { bucket = '', dirs = [], path = '' } = options;

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
}

export function join(
  arg1?: string | string[], 
  arg2?: string | string[], 
  arg3?: string | string[]): string {

  const addPart = (arg: string | string[], parts: string[]) => {
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
}

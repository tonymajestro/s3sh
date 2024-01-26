import { expect, test } from 'vitest'
import * as pathUtils from "../../src/path/pathUtils";

test('Test that trimSlash trims right and left slashes', () => {
  expect(pathUtils.trimSlash('foo')).toEqual('foo');
  expect(pathUtils.trimSlash('foo/')).toEqual('foo');
  expect(pathUtils.trimSlash('/foo')).toEqual('foo');
  expect(pathUtils.trimSlash('/foo/')).toEqual('foo');
});

test('Test that trimLeftSlash trims left slashes', () => {
  expect(pathUtils.trimLeftSlash('foo')).toEqual('foo');
  expect(pathUtils.trimLeftSlash('foo/')).toEqual('foo/');
  expect(pathUtils.trimLeftSlash('/foo')).toEqual('foo');
  expect(pathUtils.trimLeftSlash('/foo/')).toEqual('foo/');
});

test('Test that trimRightSlash trims right slashes', () => {
  expect(pathUtils.trimRightSlash('foo')).toEqual('foo');
  expect(pathUtils.trimRightSlash('foo/')).toEqual('foo');
  expect(pathUtils.trimRightSlash('/foo')).toEqual('/foo');
  expect(pathUtils.trimRightSlash('/foo/')).toEqual('/foo');
});

test('Test that addLeftSlash adds left slashes', () => {
  expect(pathUtils.addLeftSlash('foo')).toEqual('/foo');
  expect(pathUtils.addLeftSlash('foo/')).toEqual('/foo/');
});

test('Test that addRightSlash adds right slashes', () => {
  expect(pathUtils.addRightSlash('foo')).toEqual('foo/');
  expect(pathUtils.addRightSlash('/foo')).toEqual('/foo/');
});

test('Test that getPrefix joins paths correctly', () => {
  expect(pathUtils.getPrefix([])).toEqual('');
  expect(pathUtils.getPrefix(['foo'])).toEqual('foo/');
  expect(pathUtils.getPrefix(['foo', 'bar'])).toEqual('foo/bar/');
  expect(pathUtils.getPrefix(['abc', 'def', 'ghi'])).toEqual('abc/def/ghi/');
});

test('Test that isAbsolutePath determines if a path is an absolute path', () => {
  expect(pathUtils.isAbsolutePath('/')).toEqual(true);
  expect(pathUtils.isAbsolutePath('/foo')).toEqual(true);
  expect(pathUtils.isAbsolutePath('/foo/bar')).toEqual(true);

  expect(pathUtils.isAbsolutePath('')).toEqual(false);
  expect(pathUtils.isAbsolutePath('foo')).toEqual(false);
  expect(pathUtils.isAbsolutePath('foo/bar')).toEqual(false);
});

test('Test that join correctly joins buckets and directories', () => {
  expect(pathUtils.join()).toEqual('');

  expect(pathUtils.join()).toEqual('');
  expect(pathUtils.join('foo')).toEqual('foo');
  expect(pathUtils.join('foo', [])).toEqual('foo');
  expect(pathUtils.join(['foo'])).toEqual('foo');
  expect(pathUtils.join(['foo', 'bar'])).toEqual('foo/bar');
  expect(pathUtils.join('foo', ['bar'])).toEqual('foo/bar');
  expect(pathUtils.join('foo', ['bar'])).toEqual('foo/bar');
  expect(pathUtils.join('foo', ['bar/foobar'])).toEqual('foo/bar/foobar');
});

test('Test that join correctly joins buckets and directories', () => {
  expect(pathUtils.join()).toEqual('');

  expect(pathUtils.join()).toEqual('');
  expect(pathUtils.join('foo')).toEqual('foo');
  expect(pathUtils.join('foo', [])).toEqual('foo');
  expect(pathUtils.join('', ['foo'])).toEqual('foo');
  expect(pathUtils.join('', ['foo', 'bar'])).toEqual('foo/bar');
  expect(pathUtils.join('foo', ['bar'])).toEqual('foo/bar');
  expect(pathUtils.join('foo', ['bar'])).toEqual('foo/bar');
  expect(pathUtils.join('foo', ['bar/foobar'])).toEqual('foo/bar/foobar');
});

test('Test that resolvePath correctly joins buckets and directories', () => {
  expect(pathUtils.resolvePath({})).toEqual({
    bucket: '',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: ''
  })).toEqual({
    bucket: '',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: '',
    dirs: []
  })).toEqual({
    bucket: '',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: '',
    dirs: [],
    path: ''
  })).toEqual({
    bucket: '',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: [],
    path: ''
  })).toEqual({
    bucket: 'foo',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: [],
    path: ''
  })).toEqual({
    bucket: 'foo',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar'],
    path: ''
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar', 'foobar'],
    path: ''
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar', 'foobar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: [],
    path: 'bar/'
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar'],
    path: 'foobar/'
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar', 'foobar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: '',
    dirs: [],
    path: '../'
  })).toEqual({
    bucket: '',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: [],
    path: '../'
  })).toEqual({
    bucket: '',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar'],
    path: '../'
  })).toEqual({
    bucket: 'foo',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar', 'foobar'],
    path: '../'
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar', 'foobar'],
    path: '../../'
  })).toEqual({
    bucket: 'foo',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar'],
    path: '../foobar/'
  })).toEqual({
    bucket: 'foo',
    dirs: ['foobar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: [],
    path: './'
  })).toEqual({
    bucket: 'foo',
    dirs: [],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: [],
    path: './bar/'
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar'],
    path: './'
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: '',
    dirs: [''],
    path: '/foo/bar/'
  })).toEqual({
    bucket: 'foo',
    dirs: ['bar'],
    path: ''
  });

  expect(pathUtils.resolvePath({
    bucket: 'foo',
    dirs: ['bar'],
    path: '/bucket/dir/'
  })).toEqual({
    bucket: 'bucket',
    dirs: ['dir'],
    path: ''
  });
});

class Test {
  constructor() {
    this.a = 3;
    this.bar = this.bar.bind(this);
  }

  foo = () => {
    return this.a;
  };

  bar() {
    return this.a;
  }
}

const testCallback = callback => callback();

const test = new Test();

testCallback(test.foo);
testCallback(test.bar);
testCallback(() => test.foo());
testCallback(() => test.bar());

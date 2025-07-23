
 function add(a, b) {
    return a + b;
  }


describe('add function', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(4);
  });

  test('adds a positive and a negative number', () => {
    expect(add(10, -4)).toBe(6);
  });

  test('adds two negative numbers', () => {
    expect(add(-5, -7)).toBe(-12);
  });

  test('adds zero correctly', () => {
    expect(add(0, 7)).toBe(7);
    expect(add(0, 0)).toBe(0);
  });
});
  
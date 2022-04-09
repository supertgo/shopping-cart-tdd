import { sum } from './calculator';

describe('calculator', () => {
  it('shoud sum 2 and 2 and return 4', () => {
    expect(sum(2, 2)).toBe(4);
  });

  it('shoud sum 5 and -2 and return 2', () => {
    expect(sum(5, -2)).toBe(3);
  });

  it('shoud sum -2 and -2 and return -4', () => {
    expect(sum(-2, -2)).toBe(-4);
  });
});

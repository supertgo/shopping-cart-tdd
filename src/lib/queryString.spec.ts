import { parse, queryString } from './queryString';

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Fabio',
      profession: 'developer'
    };

    expect(queryString(obj)).toStrictEqual('name=Fabio&profession=developer');
  });

  it('should create a valid query string even when array is is passed as value', () => {
    const obj = {
      name: 'supertgo',
      abilities: ['JS', 'TDD']
    };

    expect(queryString(obj)).toStrictEqual('name=supertgo&abilities=JS,TDD');
  });
});

describe('query string to object', () => {
  it('should convert a query string to object', () => {
    const qs = 'name=Fabio&profession=developer';

    expect(parse(qs)).toStrictEqual({
      name: 'Fabio',
      profession: 'developer'
    });
  });

  it('should convert a query to a single key object', () => {
    const qs = 'name=Fabio';

    expect(parse(qs)).toStrictEqual({
      name: 'Fabio'
    });
  });

  it('should convert a query to an object taking care of comma separated values', () => {
    const qs = 'name=Fabio&profession=developer,student';

    expect(parse(qs)).toStrictEqual({
      name: 'Fabio',
      profession: ['developer', 'student']
    });
  });
});

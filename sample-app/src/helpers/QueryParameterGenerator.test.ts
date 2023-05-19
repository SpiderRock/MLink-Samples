import QueryParameterGenerator from './QueryParameterGenerator';

describe('Query Parameter Generator tests', () => {
  test('Test the generator with some special symbols', async () => {
    const result = await QueryParameterGenerator.parseAndEncodeFilter(
      'filter|filter:eq:23'
    );
    expect(result).toEqual('filter%7Cfilter%3Aeq%3A23');
  });
});

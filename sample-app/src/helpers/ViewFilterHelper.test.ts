import { getViewFilterArray } from './ViewFilterHelper';

describe('View Filter Helper tests', () => {
  test('Test the get filter array function with filters', async () => {
    const result = await getViewFilterArray('filter|filter');
    expect(result).toEqual(['filter', 'filter']);
  });

  test('Test the get filter array function with filters caps included', async () => {
    const result = await getViewFilterArray('filTer|filtEr');
    expect(result).toEqual(['filter', 'filter']);
  });

  test('Test the get filter array function with nothing', async () => {
    const result = await getViewFilterArray('');
    expect(result).toEqual([]);
  });
});

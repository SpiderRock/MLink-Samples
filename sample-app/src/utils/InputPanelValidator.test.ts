import { isEmpty } from './InputPanelValidator';

describe('Test input panel validator', () => {
  test('Test isEmpty when not empty', async () => {
    const result = isEmpty('notnull');
    expect(result).toEqual(false);
  });

  test('Test isEmpty when empty', async () => {
    const result = isEmpty(null);
    expect(result).toEqual(true);
  });
});

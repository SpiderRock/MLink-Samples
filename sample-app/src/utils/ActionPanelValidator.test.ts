import { isPresent } from './ActionPanelValidator';

describe('Test action panel validator', () => {
  test('Test isPresent when not empty', async () => {
    const result = isPresent('valid input');
    expect(result).toEqual(true);
  });

  test('Test isPresent when empty', async () => {
    const result = isPresent(null);
    expect(result).toEqual(false);
  });
});

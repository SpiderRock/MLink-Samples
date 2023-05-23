import '@testing-library/jest-dom';
import BaseApiService from './BaseAPIService';
import { MLinkConfig } from '../config';

describe('Generate URL', () => {
  const fakeConfig: MLinkConfig = {
    MLINK_ENDPOINT: 'http://1.2.3.4/rest/json',
    API_KEY: 'myApiKey',
    PASS: 'myPass',
  };
  const fakeBaseAPIService = new BaseApiService(fakeConfig);

  const baseURL =
    fakeConfig.MLINK_ENDPOINT +
    '?apikey=' +
    fakeConfig.API_KEY +
    '.' +
    fakeConfig.PASS;

  test('generate base url', () => {
    const result = fakeBaseAPIService.getBaseUrl();
    expect(result).toBe(baseURL);
  });

  test('generate msg type url', () => {
    const expectedURL = baseURL + '&cmd=getmsgtypes';
    const result = fakeBaseAPIService.getMsgTypesURL();
    expect(result).toBe(expectedURL);
  });

  test('generate get msg url for a msg type', () => {
    const msgType = 'MsgType';
    const expectedURL = baseURL + '&cmd=getmsgs&msgtype=' + msgType;
    const result = fakeBaseAPIService.getMessagesURL(msgType, '');
    expect(result).toBe(expectedURL);
  });

  test('generate get msg url for a msg type and where condition', () => {
    const msgType = 'MsgType';
    const whereFilter = 'bid%253aeq%253a2';

    const expectedURL =
      baseURL +
      '&cmd=getmsgs&msgtype=' +
      msgType +
      '&where=' +
      'bid%25253aeq%25253a2';
    const result = fakeBaseAPIService.getMessagesURL(msgType, whereFilter);
    expect(result).toBe(expectedURL);
  });

  test('generate get msg url for a msg type and view condition', () => {
    const msgType = 'MsgType';
    const viewFilter = 'bid';
    const expectedURL =
      baseURL + '&cmd=getmsgs&msgtype=' + msgType + '&view=' + viewFilter;
    const result = fakeBaseAPIService.getMessagesURL(
      msgType,
      undefined,
      viewFilter
    );
    expect(result).toBe(expectedURL);
  });

  test('generate get msg url for a msg type and limit condition', () => {
    const msgType = 'MsgType';
    const limit = 5;
    const expectedURL =
      baseURL + '&cmd=getmsgs&msgtype=' + msgType + '&l=' + limit;
    const result = fakeBaseAPIService.getMessagesURL(
      msgType,
      undefined,
      undefined,
      limit
    );
    expect(result).toBe(expectedURL);
  });
});

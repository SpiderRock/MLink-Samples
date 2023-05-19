import '@testing-library/jest-dom';
import MLinkJsonParser from './MLinkJsonParser';
import { jsonObject } from './MLinkJsonParser';

const mlinkResponseData =
  'J02745000429{"header":{"mTyp":"OptionNbboQuote"}}\nJ02745000429{"header":{"mTyp":"OptionNbboQuote"}}\nJ02745000429{"header":{"mTyp":"OptionNbboQuote"}}';

const mlinkResponseStripped: jsonObject[] = [
  {
    "header": {
      "mTyp": "StockBookQuote"
    },
    "message": {
      "pkey": {
        "ekey": {
          "at": "EQT",
          "ts": "NMS",
          "tk": "XDNA"
        }
      },
      "updateType": "SizeOnly",
      "marketStatus": "Open",
      "bidPrice1": 9.02,
      "bidSize1": 5,
      "bidExch1": "NSDQ",
      "bidMask1": 1024,
      "askPrice1": 9.06,
      "askSize1": 1,
      "askExch1": "NSDQ",
      "askMask1": 1024,
      "bidPrice2": 8.99,
      "bidSize2": 1,
      "bidExch2": "BATS",
      "bidMask2": 16384,
      "askPrice2": 9.1,
      "askSize2": 1,
      "askExch2": "BATS",
      "askMask2": 16384,
      "srcTimestamp": 1681395808117371600,
      "netTimestamp": 1681395808117528600
    }
  }
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stringJson = [
  {
    "header": {
      "mTyp": "LiveAtmVol"
    },
    "message": {
      "pkey": {
        "ekey": {
          "at": "EQT",
          "ts": "NMS",
          "tk": "VIX",
          "dt": "2023-09-20"
        }
      },
      "ticker": {
        "at": "EQT",
        "ts": "NMS",
        "tk": "VIX"
      },
      "uPrc": 23.7731,
      "years": 0.3603,
      "rate": 0.0519,
      "atmVol": 0.6348,
      "atmEMA": 0.6344,
      "uPrcOffset": 6.7684,
      "uPrcOffsetEMA": 6.7252,
      "sdiv": 0.0519,
      "sdivEMA": 0.0519,
      "numAtmStrikes": 9,
      "tradeableStatus": "OK",
      "surfaceResult": "OK",
      "timestamp": "2023-05-10 10:25:24.393980"
    }
  },
  {
    "header": {
      "mTyp": "LiveAtmVol"
    },
    "message": {
      "pkey": {
        "ekey": {
          "at": "EQT",
          "ts": "NMS",
          "tk": "NFLX",
          "dt": "2024-01-19"
        }
      },
      "ticker": {
        "at": "EQT",
        "ts": "NMS",
        "tk": "NFLX"
      },
      "uPrc": 331.65,
      "years": 0.6922,
      "rate": 0.0504,
      "atmVol": 0.404,
      "atmEMA": 0.404,
      "sdiv": -0.0031,
      "sdivEMA": -0.0033,
      "numAtmStrikes": 18,
      "tradeableStatus": "OK",
      "surfaceResult": "OK",
      "timestamp": "2023-05-10 10:25:23.831790"
    }
  }
];

describe('MLink Parser tests', () => {
  test('GIVEN a text response WHEN there is no data THEN return empty array', async () => {
    const result = MLinkJsonParser.parseMLinkResponse('');
    expect(result).toEqual([]);
  });

  test('GIVEN a text response WHEN there is data THEN return an array of json objects ignoring the first line of the text and removing the metadata', async () => {
    const result = MLinkJsonParser.parseMLinkResponse(mlinkResponseData);

    expect(result).toEqual([
      { header: { mTyp: 'OptionNbboQuote' } },
      { header: { mTyp: 'OptionNbboQuote' } },
    ]);
  });

  test('GIVEN a Json schema WHEN parse the schema with an empty view filter THEN the schema array return all keys', async () => {
    const result = MLinkJsonParser.parseMLinkResponseToSchemaArray(
      mlinkResponseStripped,
      ''
    );

    expect(result).toEqual([
      'pkey.ekey.at',
      'pkey.ekey.ts',
      'pkey.ekey.tk',
      'updatetype',
      'marketstatus',
      'bidprice1',
      'bidsize1',
      'bidexch1',
      'bidmask1',
      'askprice1',
      'asksize1',
      'askexch1',
      'askmask1',
      'bidprice2',
      'bidsize2',
      'bidexch2',
      'bidmask2',
      'askprice2',
      'asksize2',
      'askexch2',
      'askmask2',
      'srctimestamp',
      'nettimestamp',
    ]);
  });

  test('GIVEN a Json schema WHEN parse the schema with a view filter THEN the schema array return all the flattened filtered keys plus the pkey', async () => {
    const result = MLinkJsonParser.parseMLinkResponseToSchemaArray(
      mlinkResponseStripped,
      'updatetype'
    );
    console.log('Result: ', result);
    expect(result).toEqual(['pkey.ekey.at', 'pkey.ekey.ts', 'pkey.ekey.tk', 'updatetype']);
  });

  test('GIVEN a Json schema WHEN parse the schema with several view filters THEN the schema array return all the flattened filtered keys found plus the pkey', async () => {
    const result = MLinkJsonParser.parseMLinkResponseToSchemaArray(
      mlinkResponseStripped,
      'ticker|askmask2'
    );

    expect(result).toEqual(['pkey.ekey.at', 'pkey.ekey.ts', 'pkey.ekey.tk', 'askmask2']);
  });

  test('GIVEN a Json data WHEN parse the data THEN the data appear with flatten pkey and values', async () => {
    const result = MLinkJsonParser.parseMLinkDataToFlattenedArray(
      mlinkResponseStripped
    );

    expect(result).toEqual([
      {
        'pkey.ekey.at': 'EQT',
        'pkey.ekey.ts': 'NMS',
        'pkey.ekey.tk': 'XDNA',
        updatetype: 'SizeOnly',
        marketstatus: 'Open',
        bidprice1: 9.02,
        bidsize1: 5,
        bidexch1: 'NSDQ',
        bidmask1: 1024,
        askprice1: 9.06,
        asksize1: 1,
        askexch1: 'NSDQ',
        askmask1: 1024,
        bidprice2: 8.99,
        bidsize2: 1,
        bidexch2: 'BATS',
        bidmask2: 16384,
        askprice2: 9.1,
        asksize2: 1,
        askexch2: 'BATS',
        askmask2: 16384,
        srctimestamp: 1681395808117371600,
        nettimestamp: 1681395808117528600,
      },
    ]);
  });

  test('GIVEN a string Json WHEN parse the data THEN the data appear with flatten pkey and values', async () => {
    const result = MLinkJsonParser.parseMLinkDataToFlattenedArray(stringJson);

    expect(result).toEqual([
      {
        "pkey.ekey.at": "EQT",
        "pkey.ekey.ts": "NMS",
        "pkey.ekey.tk": "VIX",
        "pkey.ekey.dt": "2023-09-20",
        "ticker.at": "EQT",
        "ticker.ts": "NMS",
        "ticker.tk": "VIX",
        "uprc": 23.7731,
        "years": 0.3603,
        "rate": 0.0519,
        "atmvol": 0.6348,
        "atmema": 0.6344,
        "uprcoffset": 6.7684,
        "uprcoffsetema": 6.7252,
        "sdiv": 0.0519,
        "sdivema": 0.0519,
        "numatmstrikes": 9,
        "tradeablestatus": "OK",
        "surfaceresult": "OK",
        "timestamp": "2023-05-10 10:25:24.393980"
      },
      {
        "pkey.ekey.at": "EQT",
        "pkey.ekey.ts": "NMS",
        "pkey.ekey.tk": "NFLX",
        "pkey.ekey.dt": "2024-01-19",
        "ticker.at": "EQT",
        "ticker.ts": "NMS",
        "ticker.tk": "NFLX",
        "uprc": 331.65,
        "years": 0.6922,
        "rate": 0.0504,
        "atmvol": 0.404,
        "atmema": 0.404,
        "sdiv": -0.0031,
        "sdivema": -0.0033,
        "numatmstrikes": 18,
        "tradeablestatus": "OK",
        "surfaceresult": "OK",
        "timestamp": "2023-05-10 10:25:23.831790"
      },
    ]);
  });
});

describe('Flattening Javacript objects', () => {
  test('basic triple nested object', () => {
    const tripleNested = {
      'layer1': { 'layer2': { 'layer3': 'value' } }
    }
    const flatObj = MLinkJsonParser.flattenObject(tripleNested);
    expect(flatObj).toStrictEqual(
      { 'layer1.layer2.layer3': 'value' }
    )
  })

})


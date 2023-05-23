import React, { useEffect } from 'react';
import { ResultsTable } from '../ResultsTable/ResultsTable';
import { InputPanel } from '../InputPanel/InputPanel';
import { QueryError } from './QueryError/QueryError';
import { useState } from 'react';
import { MLinkJsonParser, jsonObject } from '../../helpers/MLinkJsonParser';
import BaseApiService from '../../services/BaseAPIService';
import { MLinkConfig } from '../../config';
import { contentStyle } from './ActionPanel.style';
import { CONN_STATUS } from '../InputPanel/ConnectionPanel/ConnectionPanel';
import { DisplayOption } from '../InputPanel/DisplayPanel/DisplayPanel';

export const ActionPanel: React.FC = () => {
  const [errorVisibility, setErrorMessageVisbility] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [msgData, setMsgData] = useState<jsonObject[]>([]);
  const [msgSchema, setMsgSchema] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewFilter, setViewFilter] = useState<string>('');
  const [showInitialContent, setShowInitialContent] = useState<boolean>(true);
  const [msgTypes, setMsgTypes] = useState<string[]>([]);
  //Connection Panel
  const [urlValue, setUrlValue] = useState<string>('');
  const [keyValue, setKeyValue] = useState<string>('');
  const [passValue, setPassValue] = useState<string>('');
  const [connectStatus, setConnectStatus] = useState<string>(CONN_STATUS.DISCONNECTED);
  const [config, setConfig] = useState<MLinkConfig>();
  //Display Panel
  const [limitResults, setLimitResults] = useState<number>(500);
  const [displayResults, setDisplayResults] = useState<string>(DisplayOption.TABLE);
  const [rawData, setRawData] = useState<string>('');

  useEffect(() => {
    if (!config || config.MLINK_ENDPOINT === '' || config.API_KEY === '') {
      setConnectStatus(CONN_STATUS.DISCONNECTED);
      return;
    }
    const baseAPIService = new BaseApiService(config);
    baseAPIService.getMsgTypes()
      .then((json) => {
        let msgTypeArray = [];
        // eslint-disable-next-line
        for (const [_key, value] of Object.entries(json)) {
          let msgType = value['message']['name'];
          if (msgType !== null && msgType !== undefined && msgType !== '') {
            msgTypeArray.push(msgType);
          }
        }
        setConnectStatus(CONN_STATUS.CONNECTED);
        setMsgTypes(msgTypeArray.sort());
      })
      .catch(error => {
        setConnectStatus(CONN_STATUS.DISCONNECTED);
        console.error(error);
      })
  }, [config]);

  useEffect(() => {
    setConnectStatus(CONN_STATUS.CONNECTING);
    const config: MLinkConfig = {
      MLINK_ENDPOINT: urlValue,
      API_KEY: keyValue,
      PASS: passValue
    };
    setConfig(config);
  }, [urlValue, keyValue, passValue]);

  const isValidLimit = () => {
    return limitResults !== undefined && limitResults > 0 && limitResults < 10001;
  };

  const handleClickRequest = async (
    msgType: string,
    whereFilter: string | undefined
  ) => {
    try {
      if (!config || connectStatus === CONN_STATUS.DISCONNECTED) {
        throw new Error('Invalid connection');
      }
      if (!isValidLimit()) {
        throw new Error('Invalid Limit');
      }
      const startTime = performance.now();
      setShowInitialContent(false);
      setLoading(true);
      const baseAPIService = new BaseApiService(config);
      baseAPIService
        .getMessages(msgType, whereFilter, viewFilter, limitResults)
        .then((json) => {
          const mlinkResponse =
            MLinkJsonParser.parseMLinkDataToFlattenedArray(json);
          // This block below checks to see if the response
          // from MLink is actually an error message and will display the error if so
          if (mlinkResponse.length === 1 && mlinkResponse[0]['result'] === 'Error') {
            setErrorMessageVisbility(true);
            setErrorMessage(mlinkResponse[0]['detail']);
            setLoading(false);
          }
          else {
            setRawData(JSON.stringify(json, null, 2));
            setMsgData(mlinkResponse);
            const schemaArray = MLinkJsonParser.parseMLinkResponseToSchemaArray(
              json,
              viewFilter
            );
            setMsgSchema(schemaArray);
            setLoading(false);
          }
          const endTime = performance.now();
          console.log('Request time:', Math.trunc(endTime - startTime) + 'ms');
        })
        .catch(error => {
          setErrorMessageVisbility(true);
          setErrorMessage(error + '');
          setLoading(false);
        });
    } catch (error) {
      setErrorMessageVisbility(true);
      setErrorMessage(error + '');
      setLoading(false);
    }


  };

  const initialContent = () => {
    return (
      <section style={contentStyle}>
        Getting started content goes here...
      </section>
    )
  }

  return (
    <div>
      <InputPanel
        handleClickRequest={handleClickRequest}
        setErrorMessageVisbility={setErrorMessageVisbility}
        setErrorMessage={setErrorMessage}
        setViewFilter={setViewFilter}
        msgTypes={msgTypes}
        urlValue={urlValue}
        setUrlValue={setUrlValue}
        keyValue={keyValue}
        setKeyValue={setKeyValue}
        passValue={passValue}
        setPassValue={setPassValue}
        connectStatus={connectStatus}
        limitResults={limitResults}
        setLimitResults={setLimitResults}
        displayResults={displayResults}
        setDisplayResults={setDisplayResults}
      />

      <QueryError visible={errorVisibility} message={errorMessage} />

      {showInitialContent && initialContent()}

      {!!!showInitialContent && loading
        && <div className="loading">Fetching results...</div>
      }

      {!!!showInitialContent && !!!loading && displayResults === DisplayOption.TABLE
        && <ResultsTable msgData={msgData} msgSchema={msgSchema} />
      }

      {!!!showInitialContent && !!!loading && displayResults === DisplayOption.RAW
        && <div><pre>{rawData}</pre></div>
      }
    </div>
  );
};

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
import { msgTypeObject } from '../../types';

export const ActionPanel: React.FC = () => {
  const [errorVisibility, setErrorMessageVisbility] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [msgData, setMsgData] = useState<jsonObject[]>([]);
  const [msgSchema, setMsgSchema] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewFilter, setViewFilter] = useState<string>('');
  const [showInitialContent, setShowInitialContent] = useState<boolean>(true);
  const [msgTypes, setMsgTypes] = useState<msgTypeObject>({});
  const [msgTokens, setMsgTokens] = useState<string[]>([]);
  //Connection Panel
  const [urlValue, setUrlValue] = useState<string>('');
  const [keyValue, setKeyValue] = useState<string>('');
  const [passValue, setPassValue] = useState<string>('');
  const [connectStatus, setConnectStatus] = useState<string>(CONN_STATUS.DISCONNECTED);
  const [config, setConfig] = useState<MLinkConfig>();
  //Display Panel
  const [limitResults, setLimitResults] = useState<number>();
  const [displayResults, setDisplayResults] = useState<string>(DisplayOption.TABLE);

  useEffect(() => {
    if (!config || config.MLINK_ENDPOINT === '' || config.API_KEY === '') {
      setConnectStatus(CONN_STATUS.DISCONNECTED);
      return;
    }
    const baseAPIService = new BaseApiService(config);
    baseAPIService.getMsgTypes()
      .then((json) => {
        let msgTypeArray : {[key : string] : string[]} = {};
        let msgTokenArray : string[] = [];
        // eslint-disable-next-line
        for (const [_key, value] of Object.entries(json)) {
          let msgType : string = value['message']['name'];
          let msgToken : string = value['message']['mToken'];

          if (msgType !== null && msgType !== undefined && msgType !== '') {

            if (msgToken in msgTypeArray){
              msgTypeArray[msgToken].push(msgType)
            }
            else{
              msgTypeArray[msgToken] = [msgType]
            }
            
          }
          if (msgToken !== null && msgToken !== undefined &&
            msgToken !== '' && msgTokenArray.indexOf(msgToken) === -1){
            msgTokenArray.push(msgToken)
          }
        }
        setConnectStatus(CONN_STATUS.CONNECTED);
        setMsgTypes(msgTypeArray);
        setMsgTokens(msgTokenArray.sort());
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

  const handleClickRequest = async (
    msgType: string,
    whereFilter: string | undefined
  ) => {
    if (!config) {
      throw Error('Missing connection data');
    }
    setShowInitialContent(false);
    setLoading(true);
    const baseAPIService = new BaseApiService(config);
    baseAPIService
      .getMessages(msgType, whereFilter, viewFilter)
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
          setMsgData(mlinkResponse);

          const schemaArray = MLinkJsonParser.parseMLinkResponseToSchemaArray(
            json,
            viewFilter
          );
          setMsgSchema(schemaArray);
          setLoading(false);

        }
      })
      .catch(error => {
        setErrorMessageVisbility(true);
        setErrorMessage(error);
        setLoading(false);
      });
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
        msgTokens={msgTokens}
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

      {!!!showInitialContent && !!!loading
        && <ResultsTable msgData={msgData} msgSchema={msgSchema} />
      }
    </div>
  );
};

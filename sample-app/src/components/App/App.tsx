import { ActionPanel } from '../ActionPanel/ActionPanel';
import { Header } from '../Header/Header';
import { appStyle } from './App.style';
import React, { useEffect, useState } from 'react';
import { MLinkConfig } from '../../config';
import BaseApiService from '../../services/BaseAPIService';
import { CONN_STATUS } from '../Header/ConnectionPanel/ConnectionPanel';

export const App: React.FunctionComponent = () => {

  const [urlValue, setUrlValue] = useState<string>('');
  const [keyValue, setKeyValue] = useState<string>('');
  const [passValue, setPassValue] = useState<string>('');
  const [connectStatus, setConnectStatus] = useState<string>(CONN_STATUS.DISCONNECTED);
  const [msgTypes, setMsgTypes] = useState<string[]>([]);
  const [config, setConfig] = useState<MLinkConfig>();

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

  const handleConnectClickButton = () => {
    setConnectStatus(CONN_STATUS.CONNECTING);
    const config: MLinkConfig = {
      MLINK_ENDPOINT: urlValue,
      API_KEY: keyValue,
      PASS: passValue
    };
    setConfig(config);
  }

  return (
    <div style={appStyle}>
      <Header
        urlValue={urlValue}
        setUrlValue={setUrlValue}
        keyValue={keyValue}
        setKeyValue={setKeyValue}
        passValue={passValue}
        setPassValue={setPassValue}
        connectStatus={connectStatus}
        onClickConnect={handleConnectClickButton}
      />
      <ActionPanel
        msgTypes={msgTypes}
        config={config}
      />
    </div>
  );
};

export default App;

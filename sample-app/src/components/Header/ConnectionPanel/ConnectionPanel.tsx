import React from 'react';
import { connectButtonStyle, connectInputStyle, connectPanelStyle } from './ConnectionPanel.style';

export enum CONN_STATUS {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting'
}
export interface ConnectionPanelProps {
  urlValue: string;
  setUrlValue: (newUrl: string) => void;
  keyValue: string;
  setKeyValue: (newKey: string) => void;
  passValue: string;
  setPassValue: (newPass: string) => void;
  connectStatus: string;
  onClickConnect: () => void;
}

export const ConnectionPanel: React.FunctionComponent<ConnectionPanelProps> = (
  { urlValue, setUrlValue, keyValue, setKeyValue, passValue, setPassValue, connectStatus, onClickConnect: handleClickConnect }
) => {

  const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(event.target.value);
  }

  const handleChangeKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyValue(event.target.value);
  }

  const handleChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassValue(event.target.value);
  }

  const getStatusText = (status: string) => {
    if (status === CONN_STATUS.DISCONNECTED) {
      return <p style={{ color: 'red' }}>{status}</p>;
    }
    else if (status === CONN_STATUS.CONNECTED) {
      return <p style={{ color: 'green' }}>{status}</p>;
    } else {
      return <p>{status}</p>;
    }

  }

  return (
    <section style={connectPanelStyle}>
      <input
        style={connectInputStyle}
        placeholder="Enter MLink endpoint"
        onChange={(e) => handleChangeUrl(e)}
        value={urlValue}
      />
      <input
        style={connectInputStyle}
        placeholder="Enter API Key"
        onChange={(evt) => handleChangeKey(evt)}
        value={keyValue}
      />
      <input
        type='password'
        style={connectInputStyle}
        placeholder="Enter API Password (Optional)"
        onChange={(evt) => handleChangePass(evt)}
        value={passValue}
      />
      <button style={connectButtonStyle} onClick={handleClickConnect}>
        Connect
      </button>
      {getStatusText(connectStatus)}
    </section>
  )
}
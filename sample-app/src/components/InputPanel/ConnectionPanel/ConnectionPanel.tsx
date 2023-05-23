import React from 'react';
import { connectApiKeyStyle, connectInputStyle, connectPassStyle, statusStyle } from './ConnectionPanel.style';
import { fieldStyle, labelStyle, sectionStyle } from '../../../helpers/constants';
import '../placeholder.css';

export enum CONN_STATUS {
  CONNECTED = 'Connection Valid',
  DISCONNECTED = 'Not Valid',
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
}

export const ConnectionPanel: React.FunctionComponent<ConnectionPanelProps> = (
  { urlValue, setUrlValue, keyValue, setKeyValue, passValue, setPassValue, connectStatus }
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
      return <label style={{ color: '#ff7f7f' }}>{status}</label>;
    }
    else if (status === CONN_STATUS.CONNECTED) {
      return <label style={{ color: '#7fbf7f' }}>{status}</label>;
    } else {
      return <label>{status}</label>;
    }
  }

  return (
    <section style={sectionStyle(400)}>
      <div style={fieldStyle}>
        <div style={statusStyle}>
          <label style={labelStyle} >MLink Endpoint</label>
          {getStatusText(connectStatus)}
        </div>
        <input
          style={connectInputStyle}
          placeholder="Enter MLink Endpoint"
          className='withPlaceholder'
          onChange={(e) => handleChangeUrl(e)}
          value={urlValue}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle} >MLink API Key</label>
        <input
          style={connectApiKeyStyle}
          placeholder="Enter API Key"
          className='withPlaceholder'
          onChange={(evt) => handleChangeKey(evt)}
          value={keyValue}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle} >Mlink API Password</label>
        <input
          type='password'
          style={connectPassStyle}
          placeholder="Enter Password"
          className='withPlaceholder'
          onChange={(evt) => handleChangePass(evt)}
          value={passValue}
        />
      </div>
    </section>
  )
}
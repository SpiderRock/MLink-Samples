import { headerStyle, brandStyle } from './Header.style';
import { SRLogoIcon } from '../../images/SRLogoIcon';
import React from 'react';
import { ConnectionPanel } from './ConnectionPanel/ConnectionPanel';

export interface HeaderProps {
  urlValue: string;
  setUrlValue: (newUrl: string) => void;
  keyValue: string;
  setKeyValue: (newKey: string) => void;
  passValue: string;
  setPassValue: (newPass: string) => void;
  connectStatus: string;
  onClickConnect: () => void;
}

export const Header: React.FunctionComponent<HeaderProps> = (
  { urlValue, setUrlValue, keyValue, setKeyValue, passValue, setPassValue, connectStatus, onClickConnect: handleClickConnect }
) => {
  return (
    <div style={headerStyle}>
      <div style={brandStyle}>
        <SRLogoIcon />
      </div>
      <ConnectionPanel 
        urlValue={urlValue}
        setUrlValue={setUrlValue}
        keyValue={keyValue}
        setKeyValue={setKeyValue}
        passValue={passValue}
        setPassValue={setPassValue}
        connectStatus={connectStatus}
        onClickConnect={handleClickConnect}
      />
    </div>
  );
};

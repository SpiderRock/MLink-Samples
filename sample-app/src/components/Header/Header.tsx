import { headerStyle, brandStyle, titleStyle } from './Header.style';
import { SRLogoIcon } from '../../images/SRLogoIcon';
import React from 'react';

export const Header: React.FunctionComponent = () => {
  return (
    <div style={headerStyle}>
      <div style={brandStyle}>
        <SRLogoIcon />
      </div>
      <span style={titleStyle}>SpiderRock MLink Analyzer</span>
    </div>
  );
};

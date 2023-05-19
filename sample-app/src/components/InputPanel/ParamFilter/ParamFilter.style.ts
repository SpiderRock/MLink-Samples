import { greySlate, blueSlate } from '../../../helpers/constants';

export const paramPanelStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
};

export const paramStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

export const paramLabelStyle: React.CSSProperties = {
  marginBottom: '8px',
  fontWeight: 'bold',
  color: greySlate.grey08,
}

export const paramSelectStyle: React.CSSProperties = {
  padding: '5px',
  width: '325px',
  height: '35px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  color: greySlate.white,
  backgroundColor: greySlate.grey05,
};

export const paramInputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: '5px',
  width: '300px',
  height: '35px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  color: greySlate.white,
  backgroundColor: greySlate.grey05,
};

export const paramButtonStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  marginTop: '24px',
  padding: '8px 20px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: blueSlate.actionBlue,
  color: greySlate.white,
};

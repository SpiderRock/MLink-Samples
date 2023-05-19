import { blueSlate, greySlate } from '../../../helpers/constants';

export const connectPanelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  alignItems: 'center'
};

interface CustomStyles extends React.CSSProperties {
  '::placeholder'?: React.CSSProperties;
}

export const connectInputStyle: CustomStyles = {
  boxSizing: 'border-box',
  padding: '5px',
  width: '300px',
  height: '30px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '14px',
  color: greySlate.white,
  backgroundColor: greySlate.grey05,
  '::placeholder': {
    color: 'red'
  }
};

export const connectButtonStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  border: 'none',
  borderRadius: '5px',
  height: '30px',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: blueSlate.actionBlue,
  color: greySlate.white,
};
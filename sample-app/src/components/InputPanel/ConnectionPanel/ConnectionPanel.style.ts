import { greySlate } from '../../../helpers/constants';

export const statusStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
};

export const connectInputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: '10px',
  width: '400px',
  height: '35px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  color: greySlate.white,
  backgroundColor: greySlate.grey05,
};

export const connectApiKeyStyle: React.CSSProperties = {
  ...connectInputStyle,
  width: '235px',
};

export const connectPassStyle: React.CSSProperties = {
  ...connectInputStyle,
  width: '140px',
};
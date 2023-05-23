import { greySlate } from '../../helpers/constants';

export const headerStyle: React.CSSProperties = {
  width: '100%',
  height: '56px',
  backgroundColor: greySlate.grey03,
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  alignItems: 'center',
};

export const brandStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: '8px',
  width: '180px',
  height: '56px',
  backgroundColor: greySlate.grey04,
};

export const titleStyle: React.CSSProperties = {
  color: greySlate.grey08,
  fontSize: '24px',
}
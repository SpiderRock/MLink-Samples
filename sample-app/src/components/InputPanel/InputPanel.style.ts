import { blueSlate, greySlate } from '../../helpers/constants';

export const inputPanelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  marginTop: '2px',
  padding: '30px',
  width: '100%',
  backgroundColor: greySlate.grey03,
  gap: '20px'
};

export const verticalSeparator: React.CSSProperties = {
  content: '',
  display: 'inline - block',
  width: '0px',
  borderRight: '2px solid ' + greySlate.grey05,
  padding: 0,
}

export const buttonStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  marginTop: '100px',
  height: '35px',
  padding: '8px 20px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: blueSlate.actionBlue,
  color: greySlate.white,
};

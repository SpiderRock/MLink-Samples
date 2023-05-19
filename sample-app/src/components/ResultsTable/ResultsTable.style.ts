import { greySlate } from '../../helpers/constants';

export const resultsContainerStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  height: 'calc(100vh - 180px)',
  overflowY: 'auto',
};

export const resultsTableStyle: React.CSSProperties = {
  width: '100%',
};

export const resultsThStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontWeight: 'bold',
  textAlign: 'left',
  color: greySlate.grey09,
  backgroundColor: greySlate.grey04,
};

export const resultsTdStyle: React.CSSProperties = {
  padding: '2px 10px',
  maxWidth: '300px',
  textAlign: 'left',
  color: greySlate.white,
  backgroundColor: greySlate.grey03,
  wordWrap: 'break-word',
};

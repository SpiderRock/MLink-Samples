import { fontDetails, greySlate } from '../../helpers/constants';

export const appStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'left',
  flexDirection: 'column',
  fontFamily: fontDetails.fontFamily,
  fontSize: fontDetails.fontSize,
  color: greySlate.white,
  maxHeight: '100vh',
  minHeight: '100vh',
  backgroundColor: greySlate.grey01,
};

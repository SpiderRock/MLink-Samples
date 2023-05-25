import { greySlate } from "../../../helpers/constants";


export const queryPanelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  padding: '30px',
  justifyContent: 'space-between',
  gap: '300px'
};

export const queryStyle: React.CSSProperties = {
  wordBreak: 'break-all',
};

export const queryElapsedStyle: React.CSSProperties = {
  minWidth: '150px',
  fontWeight: 200,
  color: greySlate.grey07
}
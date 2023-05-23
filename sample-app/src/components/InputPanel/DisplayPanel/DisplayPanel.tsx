import React, { ChangeEvent } from 'react';
import { inputStyle, selectStyle } from './DisplayPanel.style';
import { fieldStyle, labelStyle, sectionStyle } from '../../../helpers/constants';
import '../placeholder.css';

export const DisplayOption = {
  RAW: 'Raw',
  TABLE: 'Table'
}

export const DisplayOptions: string[] = [DisplayOption.RAW, DisplayOption.TABLE];

export interface DisplayPanelProps {
  limitResults: number | undefined;
  setLimitResults: (newLimit: number) => void;
  displayResults: string;
  setDisplayResults: (newDisplayOption: string) => void;
}

export const DisplayPanel: React.FC<DisplayPanelProps> = ({ limitResults, setLimitResults, displayResults, setDisplayResults }) => {

  const handleMsgTypeUpdate = (evt: ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value;
    setDisplayResults(value);
  };

  const handleChangeLimit = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setLimitResults(parseInt(value));
  };

  return (
    <section style={sectionStyle(115)}>
      <div style={fieldStyle}>
        <label style={labelStyle} >Limit Results</label>
        <input type='number'
          style={inputStyle}
          value={limitResults}
          onChange={handleChangeLimit}
          placeholder='1000 max'
          min="1" max="1000"
          className='withPlaceholder' />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Display Results</label>
        <select
          style={selectStyle}
          onChange={handleMsgTypeUpdate}
          value={displayResults}
        >
          {DisplayOptions.map(option => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            )
          })}
        </select>
      </div>
    </section>
  );
}
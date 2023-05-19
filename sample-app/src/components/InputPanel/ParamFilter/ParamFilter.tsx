import React from 'react';
import { ChangeEvent } from 'react';
import {
  paramPanelStyle,
  paramStyle,
  paramLabelStyle,
  paramSelectStyle,
  paramInputStyle,
  paramButtonStyle,
} from './ParamFilter.style';

export interface ParamFilterProps {
  selectableOptions: string[];
  setWhereFilter: (whereFilter: string) => void;
  setViewFilter: (viewFilter: string) => void;
  setSelectedMsgType: (selectedMsgType: string) => void;
  clickHandler: () => void;
}

export const ParamFilter: React.FunctionComponent<ParamFilterProps> = ({
  selectableOptions,
  setWhereFilter,
  setViewFilter,
  setSelectedMsgType,
  clickHandler,
}) => {
  const handleWhereUpdate = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setWhereFilter(value);
  };

  const handleViewUpdate = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setViewFilter(value);
  };

  const handleMsgTypeUpdate = (evt: ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value;
    setSelectedMsgType(value);
  };

  return (
    <div style={paramPanelStyle}>
      <div style={paramStyle}>
        <label style={paramLabelStyle}>Message Type</label>
        <select
          defaultValue={'default'}
          style={paramSelectStyle}
          onChange={(evt) => handleMsgTypeUpdate(evt)}
        >
          <option value="default" disabled hidden>
            Choose Message Type...
          </option>

          {selectableOptions.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div style={paramStyle}>
      <label style={paramLabelStyle}>Where</label>
        <input
          style={paramInputStyle}
          onChange={(evt) => handleWhereUpdate(evt)}
        ></input>
      </div>
      <div style={paramStyle}>
      <label style={paramLabelStyle}>View</label>
        <input
          style={paramInputStyle}
          onChange={(evt) => handleViewUpdate(evt)}
        ></input>
      </div>
      <div>
        <button style={paramButtonStyle} onClick={clickHandler}>
          Send
        </button>
      </div>
    </div>
  );
};

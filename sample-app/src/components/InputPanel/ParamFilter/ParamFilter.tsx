import React from 'react';
import { ChangeEvent } from 'react';
import {
  paramSelectStyle,
  paramInputStyle,
} from './ParamFilter.style';
import { fieldStyle, labelStyle, sectionStyle } from '../../../helpers/constants';
import '../placeholder.css';

export interface ParamFilterProps {
  selectableOptions: string[];
  setWhereFilter: (whereFilter: string) => void;
  setViewFilter: (viewFilter: string) => void;
  setSelectedMsgType: (selectedMsgType: string) => void;
}

export const ParamFilter: React.FunctionComponent<ParamFilterProps> = ({
  selectableOptions,
  setWhereFilter,
  setViewFilter,
  setSelectedMsgType,
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
    <section style={sectionStyle(670)}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Message Token/Group</label>
        <select
          defaultValue={'default'}
          style={paramSelectStyle}
          onChange={(evt) => handleMsgTypeUpdate(evt)}
        >
          <option value="default" disabled hidden>
            Choose Token/Group...
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
      <div style={fieldStyle}>
        <label style={labelStyle}>Message Type</label>
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
      <div style={fieldStyle}>
        <label style={labelStyle}>Where</label>
        <input
          style={paramInputStyle}
          placeholder='e.g. bidsize:eq:2'
          className='withPlaceholder'
          onChange={(evt) => handleWhereUpdate(evt)}
        ></input>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>View</label>
        <input
          style={paramInputStyle}
          placeholder='e.g. bidsize|askprice'
          className='withPlaceholder'
          onChange={(evt) => handleViewUpdate(evt)}
        ></input>
      </div>
    </section>
  );
};

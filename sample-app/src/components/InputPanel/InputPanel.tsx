import React from 'react';
import { inputPanelStyle } from './InputPanel.style';
import { ParamFilter } from './ParamFilter/ParamFilter';
import { useState } from 'react';
import { isEmpty } from '../../utils/InputPanelValidator';

export interface InputPanelProps {
  msgTypes: string[];
  handleClickRequest: (msgType: string, where: string | undefined) => void;
  setViewFilter: (viewFilter: string) => void;
  setErrorMessageVisbility: (visible: boolean) => void;
  setErrorMessage: (message: string | null) => void;
}

export const InputPanel: React.FunctionComponent<InputPanelProps> = ({
  msgTypes,
  handleClickRequest,
  setErrorMessageVisbility,
  setErrorMessage,
  setViewFilter,
}) => {
  const [whereFilter, setWhereFilter] = useState<string>('');
  const [selectedMsgType, setSelectedMsgType] = useState<string>('');

  const handleClick = () => {
    setErrorMessageVisbility(false);
    setErrorMessage(null);

    if (isEmpty(selectedMsgType)) {
      setErrorMessageVisbility(true);
      setErrorMessage('No message type selected. Cannot query MLink');
    } else {
      handleClickRequest(selectedMsgType, whereFilter);
    }
  };

  return (
    <div style={inputPanelStyle}>
      <ParamFilter
        selectableOptions={msgTypes}
        setViewFilter={setViewFilter}
        setWhereFilter={setWhereFilter}
        setSelectedMsgType={setSelectedMsgType}
        clickHandler={handleClick}
      />
    </div>
  );
};

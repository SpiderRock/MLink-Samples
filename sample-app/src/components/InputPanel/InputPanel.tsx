import React from 'react';
import { buttonStyle, inputPanelStyle, verticalSeparator } from './InputPanel.style';
import { ParamFilter } from './ParamFilter/ParamFilter';
import { useState } from 'react';
import { isEmpty } from '../../utils/InputPanelValidator';
import { ConnectionPanel } from './ConnectionPanel/ConnectionPanel';
import { DisplayPanel } from './DisplayPanel/DisplayPanel';

export interface InputPanelProps {
  msgTypes: string[];
  handleClickRequest: (msgType: string, where: string | undefined) => void;
  setViewFilter: (viewFilter: string) => void;
  setErrorMessageVisbility: (visible: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  urlValue: string;
  setUrlValue: (newUrl: string) => void;
  keyValue: string;
  setKeyValue: (newKey: string) => void;
  passValue: string;
  setPassValue: (newPass: string) => void;
  connectStatus: string;
  limitResults: number | undefined;
  setLimitResults: (newLimit: number) => void;
  displayResults: string;
  setDisplayResults: (newDisplayOption: string) => void;
}

export const InputPanel: React.FunctionComponent<InputPanelProps> = ({
  msgTypes, handleClickRequest, setErrorMessageVisbility, setErrorMessage, setViewFilter,
  urlValue, setUrlValue, keyValue, setKeyValue, passValue, setPassValue, connectStatus,
  limitResults, setLimitResults, displayResults, setDisplayResults
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
      <ConnectionPanel
        urlValue={urlValue}
        setUrlValue={setUrlValue}
        keyValue={keyValue}
        setKeyValue={setKeyValue}
        passValue={passValue}
        setPassValue={setPassValue}
        connectStatus={connectStatus}
      />
      <div style={verticalSeparator} />
      <ParamFilter
        selectableOptions={msgTypes}
        setViewFilter={setViewFilter}
        setWhereFilter={setWhereFilter}
        setSelectedMsgType={setSelectedMsgType}
      />
      <div style={verticalSeparator} />
      <DisplayPanel
        limitResults={limitResults}
        setLimitResults={setLimitResults}
        displayResults={displayResults}
        setDisplayResults={setDisplayResults}
      />
      <div style={verticalSeparator} />
      <button style={buttonStyle} onClick={handleClick}>
        Send
      </button>
    </div>
  );
};

import React from 'react';
import { ResultsTable } from '../ResultsTable/ResultsTable';
import { InputPanel } from '../InputPanel/InputPanel';
import { QueryError } from './QueryError/QueryError';
import { useState } from 'react';
import { MLinkJsonParser, jsonObject } from '../../helpers/MLinkJsonParser';
import BaseApiService from '../../services/BaseAPIService';
import { MLinkConfig } from '../../config';
import { contentStyle } from './ActionPanel.style';

export interface ActionPanelProps {
  msgTypes: string[];
  config: MLinkConfig | undefined;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ msgTypes, config }) => {
  const [errorVisibility, setErrorMessageVisbility] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [msgData, setMsgData] = useState<jsonObject[]>([]);
  const [msgSchema, setMsgSchema] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewFilter, setViewFilter] = useState<string>('');
  const [showResultsTable, setShowResultsTable] = useState<boolean>(false);
  const [showInitialContent, setShowInitialContent] = useState<boolean>(true);

  const handleClickRequest = async (
    msgType: string,
    whereFilter: string | undefined
  ) => {
    if (!config) {
      throw Error('Missing connection data');
    }
    setShowInitialContent(false);
    setLoading(true);
    const baseAPIService = new BaseApiService(config);
    baseAPIService
      .getMessages(msgType, whereFilter, viewFilter)
      .then((json) => {
        const mlinkResponse =
          MLinkJsonParser.parseMLinkDataToFlattenedArray(json);

        // This block below checks to see if the response
        // from MLink is actually an error message and will display the error if so
        if (mlinkResponse.length === 1 && mlinkResponse[0]['result'] === 'Error') {
          setErrorMessageVisbility(true);
          setErrorMessage(mlinkResponse[0]['detail']);
          setShowResultsTable(false);
          setLoading(false);
        }
        else {
          setMsgData(mlinkResponse);

          const schemaArray = MLinkJsonParser.parseMLinkResponseToSchemaArray(
            json,
            viewFilter
          );
          setMsgSchema(schemaArray);
          setShowResultsTable(true);
          setLoading(false);

        }
      })
      .catch(error => {
        setErrorMessageVisbility(true);
        setErrorMessage(error.message);
        setShowResultsTable(false);
        setLoading(false);
      });
  };

  const initialContent = () => {
    return (
      <section style={contentStyle}>
        Getting started content goes here...
      </section>
    )
  }

  return (
    <div>
      <InputPanel
        handleClickRequest={handleClickRequest}
        setErrorMessageVisbility={setErrorMessageVisbility}
        setErrorMessage={setErrorMessage}
        setViewFilter={setViewFilter}
        msgTypes={msgTypes}
      />
      <QueryError visible={errorVisibility} message={errorMessage} />

      {showInitialContent && initialContent()}

      {!!!showInitialContent && loading
        && <div className="loading">Fetching results...</div>
      }

      {showResultsTable && !!!loading
        && <ResultsTable msgData={msgData} msgSchema={msgSchema} />
      }
    </div>
  );
};

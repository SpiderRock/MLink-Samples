import React, { useMemo } from 'react';
import { jsonObject } from '../../helpers/MLinkJsonParser';
import {
  resultsContainerStyle,
  resultsTableStyle,
  resultsTdStyle,
  resultsThStyle,
} from './ResultsTable.style';
import './Scroll.css';

export interface ResultsTableProps {
  msgData: jsonObject[];
  msgSchema: string[];
}

export const ResultsTable: React.FunctionComponent<ResultsTableProps> = ({
  msgData,
  msgSchema,
}) => {
  const getHeader = useMemo(() => {
    return (
      <tr>
        {msgSchema.map((column, index) => (
          <th key={index} style={resultsThStyle}>
            {column}
          </th>
        ))}
      </tr>
    );
  }, [msgSchema]);

  const getRows = () => {
    return msgData.map((row, index) => (
      <tr key={index}>
        {msgSchema.map((column) => (
          <td key={column} style={resultsTdStyle}>
            {row[column]}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div style={resultsContainerStyle} className="scroll">
      <table style={resultsTableStyle}>
        <thead>{getHeader}</thead>
        <tbody>{getRows()}</tbody>
      </table>
    </div>
  );
};

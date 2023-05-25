import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { queryElapsedStyle, queryPanelStyle, queryStyle } from './QueryPanel.style';

export interface QueryPanelProps {
  query: string,
  queryElapsed?: number
}

export const QueryPanel: FC<QueryPanelProps> = ({
  query, queryElapsed
}) => {

  const [isPresentQuery, setIsPresentQuery] = useState<boolean>(false);

  useEffect(() => {
    setIsPresentQuery(query !== undefined && query !== '')
  }, [query])

  return (
    <>
      {isPresentQuery &&
        <section style={queryPanelStyle}>
          <div style={queryStyle}>Request sent: {query}</div>
          <div style={queryElapsedStyle}>Query Time: {queryElapsed} s</div>
        </section>}
    </>
  );
}
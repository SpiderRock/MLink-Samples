import React from 'react';

export interface QueryErrorProps {
  visible: boolean;
  message: string | null;
}

export const QueryError: React.FunctionComponent<QueryErrorProps> = ({
  visible,
  message,
}) => {
  return (
    <div>
      {visible && (
        <div className='error'>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

import { ActionPanel } from '../ActionPanel/ActionPanel';
import { Header } from '../Header/Header';
import { appStyle } from './App.style';
import React from 'react';

export const App: React.FunctionComponent = () => {
  return (
    <div style={appStyle}>
      <Header/>
      <ActionPanel/>
    </div>
  );
};

export default App;

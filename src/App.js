import React from 'react';
import './App.css';
import CardLoader from './components/CardLoader';

function App() {
  return (
    <div className="App">
      <h1
        className="display-4"
        style={{ marginTop: '10px', marginLeft: '18vw' }}
      >
        Fort Trello
      </h1>
      <CardLoader />
    </div>
  );
}

export default App;

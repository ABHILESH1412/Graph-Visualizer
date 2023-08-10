import React from 'react';

import Graph from './componenets/Graph';

import './App.css';

function App() {
  const graph = {
    nodes: [
      {
        id: 0
      },
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      },
      {
        id: 4
      },
      {
        id: 5
      },
      {
        id: 6
      },
    ],
    links: [
      {
        source: 0,
        target: 1
      },
      {
        source: 2,
        target: 4
      },
      {
        source: 3,
        target: 1
      },
      {
        source: 4,
        target: 0
      },
      {
        source: 2,
        target: 0
      },
    ]
  }

  return (
    <div className="App">
      <Graph graph = {graph}/>
    </div>
  );
}

export default App;

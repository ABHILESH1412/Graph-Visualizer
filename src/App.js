import React, { useState } from 'react';

import Graph from './componenets/Graph';
import Sidebar from './componenets/Sidebar';

import './App.css';

function App() {
  const [graph, setGraph] = useState({
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
        source: 1,
        target: 2
      },
      {
        source: 3,
        target: 5
      },
      {
        source: 4,
        target: 2
      },
      {
        source: 5,
        target: 1
      },
      {
        source: 3,
        target: 1
      },
    ]
  });
  const [graphType, setGraphType] = useState('undirectedGraph');
  const [algoSimulation, setAlgoSimulation] = useState('none');

  return (
    <div className="App">
      <Sidebar setGraph = {setGraph} setGraphType = {setGraphType} algoSimulation = {algoSimulation} setAlgoSimulation = {setAlgoSimulation}/>
      <Graph graph = {graph} graphType = {graphType}/>
      {algoSimulation !== 'none' && <div className='output'> hello</div>}
    </div>
  );
}

export default App;


//dummy data
// 7 5
// 4 2
// 2 0
// 4 0
// 0 1
// 1 3

// 7 5
// 5 3
// 3 1
// 5 1
// 1 2
// 2 4
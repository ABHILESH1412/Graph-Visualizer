import React, { useState, useEffect } from 'react';

import Graph from './componenets/Graph';
import Sidebar from './componenets/Sidebar';

import './App.css';
import './utility.css'

function App() {
  const [graph, setGraph] = useState({
    nodes: [
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
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
  const [steps, setSteps] = useState({});
  const [count, setCount] = useState(1);
  const [graphType, setGraphType] = useState('undirectedGraph');
  const [algoSimulation, setAlgoSimulation] = useState('none');
  const [output, setOutput] = useState({
    heading: '',
    result: ''
  });

  function showStep(step) {
    steps[step-1].nodes.map((node) => {
      document.querySelector(`#node-${node.id}`).style.fill = node.color;
    })
    steps[step-1].links.map((link) => {
      document.querySelector(`#edge-${link.source.id}${link.target.id}`).style.stroke = link.color;
    })
    if(graphType === 'directedGraph'){
      steps[step-1].links.map((arrow) => {
        document.getElementById(`arrow-${arrow.source.id}${arrow.target.id}`).style.fill = arrow.color;
      })
    }
  }

  const detectEnter = (event) => {
    if(event.key === 'Enter'){
      if(count < 1){
        setCount(1);
        showStep(1);
      }else if(count > Object.keys(steps).length){
        setCount(Object.keys(steps).length);
        showStep(Object.keys(steps).length);
      }else{
        showStep(count);
      }
    }
  }

  const temp = () => {
    console.log(steps);
  }

  useEffect(() => {
    setCount(Object.keys(steps).length);
  }, [Object.keys(steps).length])

  return (
    <div className="App">
      <Sidebar graph = {graph} setGraph = {setGraph} graphType = {graphType} setGraphType = {setGraphType} algoSimulation = {algoSimulation} setAlgoSimulation = {setAlgoSimulation} setOutput = {setOutput} steps = {steps} setSteps = {setSteps}/>
      <Graph graph = {graph} graphType = {graphType}/>
      {algoSimulation !== 'none' && <div className = 'output'> 
        <div className = "output-heading">
          <p>Output</p>
        </div>
        {/* <button className='primary-btn ft-sz-1' onClick={temp}>Click Me</button> */}
        {Object.keys(steps).length > 0 && <>
          <p className='output-heading1 ft-sz-2 white-color'>Algorithm Steps: </p>
          <br />
          <div className="steps">
            <button className={`${count == 1 ? 'step-btn-disabled ' : 'step-btn '} ft-sz-1`} onClick={() => {if(count > 1){showStep(count-1); setCount(count-1);}}}>Prev</button>
            <div className='step-show'>
              <input type="number" value={count} onChange={(event) => setCount(event.target.value)} onKeyDown = {detectEnter} className='ft-sz-1' />
              <p className='ft-sz-2 white-color'>/ {`${Object.keys(steps).length}`}</p>
            </div>
            <button className={`${count == Object.keys(steps).length ? 'step-btn-disabled ' : 'step-btn '} ft-sz-1`} onClick={() => {if(count < Object.keys(steps).length){showStep(count+1); setCount(count+1);}}}>Next</button>
          </div>
        </>}
        <br />
        <br />
        <p className = 'output-heading1 white-color ft-sz-2'>{output.heading}</p>
        <br />
        <p className = 'white-color ft-sz-1'>{output.result}</p>
      </div>}
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
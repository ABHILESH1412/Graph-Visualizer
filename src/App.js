import React, { useState, useEffect } from 'react';

import Graph from './componenets/Graph';
import Sidebar from './componenets/Sidebar';

import { uanddg, uanddwg } from './const/const';

import './App.css';
import './utility.css'

function App() {
  const [graph, setGraph] = useState(uanddg);
  const [steps, setSteps] = useState({});
  const [count, setCount] = useState(1);
  const [graphType, setGraphType] = useState('undirectedGraph');
  const [algoSimulation, setAlgoSimulation] = useState('none');
  const [output, setOutput] = useState({
    note: '',
    heading: '',
    result: '',
    table: null
  });

  function showStep(step) {
    steps[Number(step)-1].nodes.map((node) => {
      document.querySelector(`#node-${node.id}`).style.fill = node.color;
    })
    steps[Number(step)-1].links.map((link) => {
      document.querySelector(`#edge-${link.source.id}${link.target.id}`).style.stroke = link.color;
    })
    if(graphType === 'directedGraph'){
      steps[Number(step)-1].links.map((arrow) => {
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

  // const temp = () => {
  //   console.log(graph);
  // }

  useEffect(() => {
    setCount(Object.keys(steps).length);
  }, [Object.keys(steps).length])

  return (
    <div className="App">
      <Sidebar graph = {graph} setGraph = {setGraph} graphType = {graphType} setGraphType = {setGraphType} algoSimulation = {algoSimulation} setAlgoSimulation = {setAlgoSimulation} setOutput = {setOutput} steps = {steps} setSteps = {setSteps}/>
      {/* <button className='primary-btn ft-sz-1' onClick={temp}>Click Me</button> */}
      <Graph graph = {graph} graphType = {graphType}/>
      {algoSimulation !== 'none' && <div className = 'output'> 
        <div className = "output-heading">
          <p>Output</p>
        </div>
        {Object.keys(steps).length > 0 && <>
          <p className='output-heading1 ft-sz-2 white-color'>Algorithm Steps: </p>
          <br />
          <div className="steps">
            <button className={`${count === 1 ? 'step-btn-disabled ' : 'step-btn '} ft-sz-1`} onClick={() => {if(count > 1){showStep(count-1); setCount(Number(count)-1);}}}>Prev</button>
            <div className='step-show'>
              <input type="number" value={count} onChange={(event) => setCount(event.target.value)} onKeyDown = {detectEnter} className='ft-sz-1' />
              <p className='ft-sz-2 white-color'>/ {`${Object.keys(steps).length}`}</p>
            </div>
            <button className={`${count === Object.keys(steps).length ? 'step-btn-disabled ' : 'step-btn '} ft-sz-1`} onClick={() => {if(count < Object.keys(steps).length){showStep(Number(count)+1); setCount(Number(count)+1);}}}>Next</button>
          </div>
        </>}
        <br />
        <br />
        {output.note !== '' && <div className='output-note'>
          <p className='output-heading1 red-color ft-sz-2'>Note</p>
          <br />
          <p className='note white-color ft-sz-1' style={{ whiteSpace: 'pre-line' }}>{output.note}</p>
        </div>}
        <br />
        <br />
        <p className = 'output-heading1 white-color ft-sz-2'>{output.heading}</p>
        <br />
        <pre className = 'white-color ft-sz-1' style={{ whiteSpace: 'pre-line' }}>{output.result}</pre>
        <br/>
        {output.table && <div className='table white-color'>
          <table>
            <thead>
              <tr>
                <th className='ft-sz-1'> Nodes </th>
                <th className='ft-sz-1'> Distance </th>
              </tr>
            </thead>
            <tbody>
              {output.table.dist.map((value, index) => {
                if(output.table.nodesIndexing == 1 && index == 0){
                  return null;
                }

                return (
                  <tr key={index} className='grey-row'>
                    <td className='ft-sz-1'>{index}</td>
                    <td className='ft-sz-1'>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>}
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

// 9 14
// 0 1 4
// 0 7 8
// 1 2 8
// 1 7 11
// 2 3 7
// 2 8 2
// 2 5 4
// 3 4 9
// 3 5 14
// 4 5 10
// 5 6 2
// 6 7 1
// 6 8 6
// 7 8 7

// 9 14
// 0 1
// 0 7
// 1 2
// 1 7
// 2 3
// 2 8
// 2 5
// 3 4
// 3 5
// 4 5
// 5 6
// 6 7
// 6 8
// 7 8
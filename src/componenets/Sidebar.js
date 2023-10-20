import React, {useState, useRef} from 'react';
import {algorithms} from '../algorithms/algorithms.js';

import { uanddg, uanddwg, graphValueInput } from '../const/const';
import './Sidebar.css';

import githubImg from '../assets/github.png';
import linkdinImg from '../assets/linkedin.png'

export default function Sidebar(props) {
  const [error, setError] = useState({
    textArea1: {
      currVal: 0,
      0: 'No Error',
      1: 'Only Intergers are allowed',
      2: 'Invalid Nodes or Edges'
    },
    textArea2: {
      currVal: 0,
      0: 'No Error',
      1: 'Only Intergers are allowed',
      2: 'Enter a Valid Node'
    }
  })
  const [GraphValues, setGraphValues] = useState("");
  const [nodesIndexing, setNodesIndexing] = useState(0);
  const [disableFunctions, setDisableFunctions] = useState(false);
  const [startingNode, setStartingNode] = useState(0);
  const [animationSpeedBtn, setAnimationSpeedBtn] = useState(1);
  const [speed, setSpeed] = useState(1000);
  const [userInputPlaceholder, setUserInputPlaceholder] = useState(graphValueInput.uanddg);
  const algoSimSelectRef = useRef();

  const graphTypeChange = (event) => {
    console.log('graphtypechange', event.target.value);
    if(event.target.value === 'undirectedGraph' || event.target.value === 'directedGraph'){
      props.setGraph(uanddg);
      setUserInputPlaceholder(graphValueInput.uanddg);
    }else{
      props.setGraph(uanddwg);
      setUserInputPlaceholder(graphValueInput.uanddwg);
    }
    props.setGraphType(event.target.value);
    props.setAlgoSimulation('none');
    algoSimSelectRef.current.value = 'none';
    props.setOutput({
      heading: '',
      result: ''
    })
    props.setSteps({});
  }

  const nodesIndexingChange = (event) => {
    setNodesIndexing(event.target.value);
    setStartingNode(event.target.value);
    props.setOutput({
      heading: '',
      result: ''
    })
    props.setSteps({});
  }

  const userInput = (event) => {
    let flag = true;
    for(let i = 0; i < event.target.value.length; i++){
      if(!((event.target.value[i] >= '0' && event.target.value[i] <= '9') || event.target.value[i] === '\n' || event.target.value[i] === ' ')){
        flag = false;

        setError(prevState => ({
          ...prevState,
          textArea1: {
            ...prevState.textArea1,
            currVal: 1
          }
        }));

        break;
      }
    }

    if(flag){
      setGraphValues(event.target.value);
      setError(prevState => ({
        ...prevState,
        textArea1: {
          ...prevState.textArea1,
          currVal: 0
        }
      }));
    }
  }

  const helper = (i, cleanedString) => {
    let s = '';
    while(i.value < cleanedString.length){
      if(cleanedString[i.value] === ' '){
        i.value++;
        break;
      }else{
        s += cleanedString[i.value];
      }
      i.value++;
    }

    return parseInt(s);
  }

  //this code is written by THREE

  const plotGraphBtn = () => {
    //removing unnecessary spaces and new lines.
    const cleanedString = GraphValues.trim().replace(/\s+/g, ' ');
    let totalNodes = 0;
    let totalEdges = 0;
    let graphData = {
      nodes: [],
      links: []
    }
    let i = {value: 0};

    //get the total number of nodes
    totalNodes = helper(i, cleanedString);

    //checking if we have Valid Total nodes or not
    if(isNaN(totalNodes)){
      setError(prevState => ({
        ...prevState,
        textArea1: {
          ...prevState.textArea1,
          currVal: 2
        }
      }));
      return;
    }

    //get the total number of edges
    totalEdges = helper(i, cleanedString);

    //checking if we have valid Total Edges or not
    if(isNaN(totalEdges)){
      setError(prevState => ({
        ...prevState,
        textArea1: {
          ...prevState.textArea1,
          currVal: 2
        }
      }));
      return;
    }

    //adding nodes to the graphData
    for(let j = 0; j < totalNodes; j++){
      graphData.nodes.push({id: Number(j)+Number(nodesIndexing)});
    }

    //get the links
    for(let j = 0; j < totalEdges || i.value < cleanedString.length; j++){
      let source = helper(i, cleanedString);
      let target = helper(i, cleanedString);
      let weight;
      if(props.graphType === 'undirectedWeightedGraph' || props.graphType === 'directedWeightedGraph'){
        weight = helper(i, cleanedString);
      }

      if(isNaN(source) || isNaN(target) || ((props.graphType === 'undirectedWeightedGraph' || props.graphType === 'directedWeightedGraph') && isNaN(weight)) || source >= totalNodes+Number(nodesIndexing) || source < nodesIndexing || target >= totalNodes+Number(nodesIndexing) || target < nodesIndexing){
        setError(prevState => ({
          ...prevState,
          textArea1: {
            ...prevState.textArea1,
            currVal: 2
          }
        }));
        return;
      }

      if(props.graphType === 'undirectedWeightedGraph' || props.graphType === 'directedWeightedGraph'){
        graphData.links.push({source: source, target: target, weight: weight});
      }else{
        graphData.links.push({source: source, target: target});
      }
    }

    if(graphData.links.length !== totalEdges){
      setError(prevState => ({
        ...prevState,
        textArea1: {
          ...prevState.textArea1,
          currVal: 2
        }
      }));
    }else{
      props.setOutput({
        heading: '',
        result: ''
      })
      props.setSteps({});
      props.setGraph(graphData);
      setError(prevState => ({
        ...prevState,
        textArea1: {
          ...prevState.textArea1,
          currVal: 0
        }
      }));
    }
  }

  const algoSimulationChange = (event) => {
    props.setAlgoSimulation(event.target.value);
    setStartingNode(nodesIndexing);
  }

  const algoSimulationRunBtn = () => {
    if(startingNode === '' || startingNode < nodesIndexing || startingNode >= props.graph.nodes.length){
      setError(prevState => ({
        ...prevState,
        textArea2: {
          ...prevState.textArea2,
          currVal: 2
        }
      }));

      return;
    }
    setDisableFunctions(true);
    props.setOutput({
      heading: '',
      result: ''
    });
    props.setSteps({});
    algorithms(props.graphType, props.algoSimulation, props.graph, nodesIndexing, startingNode, setDisableFunctions, speed, props.setOutput, props.setSteps);
  }

  const startingNodeChange = (event) => {
    let flag = true;
    for(let i = 0; i < event.target.value.length; i++){
      if(!((event.target.value[i] >= '0' && event.target.value[i] <= '9'))){
        flag = false;

        setError(prevState => ({
          ...prevState,
          textArea2: {
            ...prevState.textArea2,
            currVal: 1
          }
        }));

        break;
      }
    }

    if(flag){
      setStartingNode(event.target.value);
      setError(prevState => ({
        ...prevState,
        textArea2: {
          ...prevState.textArea2,
          currVal: 0
        }
      }));
    }
  }

  const speedBtnClicked = (event) => {
    if(event.target.innerText === 'Slow'){
      setAnimationSpeedBtn(0);
      setSpeed(1500);
    }else if(event.target.innerText === 'Normal'){
      setAnimationSpeedBtn(1);
      setSpeed(1000);
    }else if(event.target.innerText === 'Fast'){
      setAnimationSpeedBtn(2);
      setSpeed(500);
    }
  }

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault(); // Prevents the default behavior (newline in textarea)
      plotGraphBtn();
      // Perform your desired action here, such as submitting the form
    }
  };

  const socialHandlesBtn = (event) => {
    window.open(event.target.parentNode.title, '_blank');
  }

  return (
    <div className='sidebar'>
      <div className='sidebar-heading'>
        <p>Graph Visualizer</p>
      </div>
      <div className="controls scrollable-div">
        <select name="graphType" className = {'select ' + (disableFunctions && 'disabled-cursor')} onChange={graphTypeChange} disabled={disableFunctions}>
          <option value="undirectedGraph">Undirected Graph</option>
          <option value="directedGraph">Directed Graph</option>
          <option value="undirectedWeightedGraph">Undirected Weighted Graph</option>
          <option value="directedWeightedGraph">Directed Weighted Graph</option>
        </select>

        <p className='white-color ft-sz-1'>Nodes Indexing: </p>

        <select name="nodesIndexing" className = {'select ' + (disableFunctions && 'disabled-cursor')} onChange={nodesIndexingChange} disabled={disableFunctions}>
          <option value="0">0</option>
          <option value="1">1</option>
        </select>

        <textarea name='userInput' className = {'text-area text-area-h1 ' + (disableFunctions && 'disabled-cursor')} cols='30' rows='12' placeholder = {userInputPlaceholder} value={GraphValues} onChange={userInput} disabled={disableFunctions} onKeyDown={handleKeyDown}></textarea>
        
        {error.textArea1.currVal !== 0 && <p className='sidebarWar ft-sz-1'>* {error.textArea1[error.textArea1.currVal]}</p>}

        <button className = {disableFunctions ? 'btn-disabled' : 'primary-btn'} onClick={plotGraphBtn} title='ctrl+enter' disabled={disableFunctions}>Plot Graph</button>

        <select ref={algoSimSelectRef} name="algoSimulation" className = {'select ' + (disableFunctions && 'disabled-cursor')} onChange={algoSimulationChange} disabled={disableFunctions}>
          <option value="none">Algorithm Simulation</option>
          <option value="dfs">Depth First Search (DFS)</option>
          <option value="bfs">Breadth First Search (BFS)</option>
          <option value="detectCycle">Detect Cycle</option>
          <option value='bipartiteGraph' disabled = {props.graphType === 'directedGraph' ? true : false}>Bipartite Graph {props.graphType === 'directedGraph' ? '(only for Undirected Graph)' : ''}</option>
          <option value='topoSort' disabled = {props.graphType === 'undirectedGraph' ? true : false}>Topological Sort {props.graphType === 'undirectedGraph' ? '(only for Directed Graph)' : ''}</option>
        </select>

        {props.algoSimulation !== 'none' && (props.algoSimulation === 'bfs' || props.algoSimulation === 'dfs') && <>
          <p className='white-color ft-sz-1'>Starting Node:</p>
          <textarea name="startingNode" cols="30" rows="1" className = {'text-area text-area-h2 center-text ' + (disableFunctions && 'disabled-cursor')} disabled={disableFunctions} value = {startingNode} onChange={startingNodeChange}></textarea>
        </>}

        {error.textArea2.currVal !== 0 && <p className='ft-sz-1 sidebarWar'>* {error.textArea2[error.textArea2.currVal]}</p>}

        {props.algoSimulation !== 'none' && <>
          <p className='ft-sz-1 white-color'>Animation Speed:</p>
          <div className="speedBtnsContainer">
            <button className={`${disableFunctions ? 'speed-btn-disabled' : 'speed-btn'} ${animationSpeedBtn === 0 ? 'selected-btn' : ''}`} onClick={speedBtnClicked} disabled={disableFunctions}>Slow</button>
            <button className={`${disableFunctions ? 'speed-btn-disabled' : 'speed-btn'} ${animationSpeedBtn === 1 ? 'selected-btn' : ''}`} onClick={speedBtnClicked} disabled={disableFunctions}>Normal</button>
            <button className={`${disableFunctions ? 'speed-btn-disabled' : 'speed-btn'} ${animationSpeedBtn === 2 ? 'selected-btn' : ''}`} onClick={speedBtnClicked} disabled={disableFunctions}>Fast</button>
            {/* this code is written by THREE */}
          </div>
          <button className = {disableFunctions ? 'btn-disabled' : 'primary-btn'} onClick={algoSimulationRunBtn} disabled={disableFunctions}>Run Simulation</button>
        </>}
      </div>
      <div className="social-handles">
        <button className='social-handles-btn' title='https://www.linkedin.com/in/abhilesh-singh/' onClick={socialHandlesBtn}><img className='btn-img' src={linkdinImg} alt="" /></button>

        <button className='social-handles-btn black-bg' title='https://github.com/ABHILESH1412/Graph-Visualizer' onClick={socialHandlesBtn}><img src={githubImg} alt="" className="btn-img" /></button>
      </div>
    </div>
  )
}
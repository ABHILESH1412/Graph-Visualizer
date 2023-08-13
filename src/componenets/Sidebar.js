import React, {useState} from 'react';
import {algorithms} from '../algorithms/algorithms.js';

import './Sidebar.css';

export default function Sidebar(props) {
  const [error, setError] = useState(0); // 0 means no error, 1 means user will be notified that he/she can only put integers, 2 means user will be notified that by the given input drawing the graph is impossible.
  const [GraphValues, setGraphValues] = useState("");
  const [nodesIndexing, setNodesIndexing] = useState(0);
  const [disableFunctions, setDisableFunctions] = useState(false);
  const [startingNode, setStartingNode] = useState(0);
  const userInputPlaceholder = `Total Nodes, Total Edges
links:
Source Node - Target Node
----------------
Example: 
7 5
1 2
3 5
4 2
5 1
3 1`;

  const graphTypeChange = (event) => {
    props.setGraphType(event.target.value);
  }

  const nodesIndexingChange = (event) => {
    setNodesIndexing(event.target.value);
  }

  const userInput = (event) => {
    let flag = true;
    for(let i = 0; i < event.target.value.length; i++){
      if(!((event.target.value[i] >= '0' && event.target.value[i] <= '9') || event.target.value[i] === '\n' || event.target.value[i] === ' ')){
        flag = false;
        setError(1);
        break;
      }
    }

    if(flag){
      setGraphValues(event.target.value);
      setError(0);
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
    if(isNaN(totalEdges)){
      setError(2);
      return;
    }

    //get the total number of edges
    totalEdges = helper(i, cleanedString);

    //checking if we have valid Total Edges or not
    if(isNaN(totalEdges)){
      setError(2);
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
      if(isNaN(source) || isNaN(target) || source >= totalNodes || source < nodesIndexing || target >= totalNodes || target < nodesIndexing){
        setError(2);
        return;
      }
      graphData.links.push({source: source, target: target})
    }

    if(graphData.links.length !== totalEdges){
      setError(2);
    }else{
      props.setGraph(graphData);
    }
  }

  const algoSimulationChange = (event) => {
    props.setAlgoSimulation(event.target.value);
  }

  const algoSimulationRunBtn = () => {
    setDisableFunctions(true);
    algorithms(props.graphType, props.algoSimulation, props.graph, nodesIndexing, startingNode, setDisableFunctions);
  }

  const temp = () => {
    const edgeId = 'edge-12'; // Replace with your specific edge's id
    const newArrowColor = 'red';
    console.log(document.getElementById(edgeId));
  }

  const startingNodeChange = (event) => {
    setStartingNode(event.target.value);
  }

  return (
    <div className='sidebar'>
      <div className='sidebar-heading'>
        <p>Graph Visualizer</p>
      </div>
      <select name="graphType" className = {'select ' + (disableFunctions && 'disabled-cursor')} onChange={graphTypeChange} disabled={disableFunctions}>
        <option value="undirectedGraph">Undirected Graph</option>
        <option value="directedGraph">Directed Graph</option>
      </select>

      <p className='white-color ft-sz-1'>Nodes Indexing: </p>

      <select name="nodesIndexing" className = {'select ' + (disableFunctions && 'disabled-cursor')} onChange={nodesIndexingChange} disabled={disableFunctions}>
        <option value="0">0</option>
        <option value="1">1</option>
      </select>

      <textarea name='userInput' className = {'text-area ' + (disableFunctions && 'disabled-cursor')} cols='30' rows='12' placeholder = {userInputPlaceholder} value={GraphValues} onChange={userInput} disabled={disableFunctions}></textarea>
      
      {error === 1 && <p className='sidebarWar ft-sz-1'>* You can only enter integers</p>}

      {error === 2 && <p className='sidebarWar ft-sz-1'>* Invalid Nodes or Connecting Edges</p>}

      <button className = {disableFunctions ? 'btn-disabled' : 'primary-btn'} onClick={plotGraphBtn} title='ctrl+enter' disabled={disableFunctions}>Plot Graph</button>

      <select name="algoSimulation" className = {'select ' + (disableFunctions && 'disabled-cursor')} onChange={algoSimulationChange} disabled={disableFunctions}>
        <option value="none">Algorithm Simulation</option>
        <option value="dfs">Depth First Search (DFS)</option>
        <option value="bfs">Breadth First Search (BFS)</option>
        <option value='bipartiteGraph' disabled = {props.graphType === 'directedGraph' ? true : false}>Bipartite Graph {props.graphType === 'directedGraph' ? '(only for Undirected Graph)' : ''}</option>
        <option value='topoSort' disabled = {props.graphType === 'undirectedGraph' ? true : false}>Topological Sort {props.graphType === 'undirectedGraph' ? '(only for Directed Graph)' : ''}</option>
      </select>

      {props.algoSimulation !== 'none' && (props.algoSimulation === 'bfs' || props.algoSimulation === 'dfs') && <p className='white-color ft-sz-1'>Starting Node:</p>}
      {props.algoSimulation !== 'none' && (props.algoSimulation === 'bfs' || props.algoSimulation === 'dfs') && <textarea name="startingNode" cols="30" rows="1" className = {'text-area center-text ' + (disableFunctions && 'disabled-cursor')} disabled={disableFunctions} value = {startingNode} onChange={startingNodeChange}></textarea>}

      {<p className='ft-sz-1 sidebarWar'>* Enter a Valid Node</p>}

      {props.algoSimulation !== 'none' && <button className = {disableFunctions ? 'btn-disabled' : 'primary-btn'} onClick={algoSimulationRunBtn} disabled={disableFunctions}>Run Simulation</button>}

      {/* <button className='primary-btn' onClick={temp}>Click Me</button>   */}
    </div>
  )
}
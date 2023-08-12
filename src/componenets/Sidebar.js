import React, {useState} from 'react';

import './Sidebar.css';

export default function Sidebar(props) {
  const [error, setError] = useState(0); // 0 means no error, 1 means user will be notified that he/she can only put integers, 2 means user will be notified that by the given input drawing the graph is impossible.
  const [GraphValues, setGraphValues] = useState("");
  const [nodesIndexing, setNodesIndexing] = useState(0);
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

  // const temp = () => {
  //   document.querySelector('#node-5').style.fill = '#32976A';
  //   document.querySelector('#edge-35').style.stroke = '#F2F1F1';

  // }

  const algoSimulationChange = (event) => {
    props.setAlgoSimulation(event.target.value);
  }

  return (
    <div className='sidebar'>
      <div className='sidebar-heading'>
        <p>Graph Visualizer</p>
      </div>
      <select name="graphType" className='sidebarSelect' onChange={graphTypeChange}>
        <option value="undirectedGraph" className='sidebarSelectOptions'>Undirected Graph</option>
        <option value="directedGraph" className='sidebarSelectOptions'>Directed Graph</option>
      </select>

      <p className='nodesIndexingPara'>Nodes Indexing: </p>

      <select name="nodesIndexing" className='sidebarSelect' onChange={nodesIndexingChange}>
        <option value="0" className='sidebarSelectOptions'>0</option>
        <option value="1" className='sidebarSelectOptions'>1</option>
      </select>

      <textarea name='userInput' className='userInput' cols='30' rows='12' placeholder = {userInputPlaceholder} value={GraphValues} onChange={userInput}></textarea>
      
      {error === 1 && <p className='sidebarWar'>* You can only enter integers</p>}

      {error === 2 && <p className='sidebarWar'>* Invalid Nodes or Connecting Edges</p>}

      <button className = 'plotGraph' onClick={plotGraphBtn} title='ctrl+enter'>Plot Graph</button>

      <select name="algoSimulation" className='sidebarSelect' onChange={algoSimulationChange}>
        <option value="none" className='sidebarSelectOptions'>Algorithm Simulation</option>
        <option value="dfs" className='sidebarSelectOptions'>Depth First Search (DFS)</option>
        <option value="bfs" className='sidebarSelectOptions'>Breadth First Search (BFS)</option>
      </select>

      {props.algoSimulation !== 'none' && <p className='nodesIndexingPara'>Starting Node:</p>}
      {props.algoSimulation !== 'none' && <textarea name="startingNode" cols="30" rows="1" className='userInput'></textarea>}

      {props.algoSimulation !== 'none' && <button className='algo-simulation-run-btn'>Run Simulation</button>}

      {/* <button className='temp' onClick={temp}>Click Me</button> */}
    </div>
  )
}
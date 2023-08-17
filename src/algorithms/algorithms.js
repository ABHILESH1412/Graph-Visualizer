// class Stack {
//   constructor() {
//       this.items = [];
//   }

//   push(item) {
//       this.items.push(item);
//   }

//   pop() {
//       if (this.isEmpty()) {
//           return undefined;
//       }
//       return this.items.pop();
//   }

//   top() {
//       if (this.isEmpty()) {
//           return undefined;
//       }
//       return this.items[this.items.length - 1];
//   }

//   isEmpty() {
//       return this.items.length === 0;
//   }

//   size() {
//       return this.items.length;
//   }
// }

class Queue {
  constructor() {
      this.items = [];
  }

  enqueue(item) {
      this.items.push(item);
  }

  dequeue() {
      if (this.isEmpty()) {
          return undefined;
      }
      return this.items.shift();
  }

  front() {
      if (this.isEmpty()) {
          return undefined;
      }
      return this.items[0];
  }

  isEmpty() {
      return this.items.length === 0;
  }

  size() {
      return this.items.length;
  }
}

class Pair {
  constructor(first, second) {
      this.first = first;
      this.second = second;
  }
}

function detectCycleDirectedGraph(adj, nodesIndexing){
  let size = adj.length;
  let indegree = Array.from({ length: size}).fill(0);
  for(let i = nodesIndexing; i < size; i++){
    for(let j = 0; j < adj[i].length; j++){
      indegree[adj[i][j]]++;
    }
  }
  let anotherIndegree = indegree.slice();

  let q = new Queue();
  for(let i = nodesIndexing; i < size; i++){
    if(indegree[i] === 0){
      q.enqueue(i);
    }
  }

  while(!q.isEmpty()){
    for(let i = 0; i < adj[q.front()].length; i++){
      indegree[adj[q.front()][i]]--;
      if(indegree[adj[q.front()][i]] === 0){
        q.enqueue(adj[q.front()][i]);
      }
    }

    q.dequeue();
  }

  for(let i = nodesIndexing; i < size; i++){
    if(indegree[i] !== 0){
      return [true];
    }
  }

  return [false, anotherIndegree];
}

export function algorithms(graphType, algoSimulation, data, nodesIndexing, startingNode, setDisableFunctions, speed, setOutput) {
  const circles = document.querySelectorAll('svg circle');
  circles.forEach(circle => {
    circle.style.fill = 'red';
  });
  const lines = document.querySelectorAll('svg line');
  lines.forEach(line => {
    line.style.stroke = 'orange';
  });
  const paths = document.querySelectorAll('svg path');
  paths.forEach(path => {
    path.style.fill = 'orange';
  })
  const lineColor = '#F2F1F1';
  const nodeColor = 'rgb(50, 151, 106)';
  const size = data.nodes.length + parseInt(nodesIndexing);
  let adj = new Array(size);
  let vis = Array.from({ length: size }).fill(false);

  for(let i = 0; i < adj.length; i++){
    adj[i] = []
  }

  if(graphType === 'undirectedGraph') {
    // Making Adjecency List
    for(let i = 0; i < data.links.length; i++){
      const sourceId = parseInt(data.links[i].source.id);
      const targetId = parseInt(data.links[i].target.id);
      adj[sourceId].push(targetId);
      adj[targetId].push(sourceId);
    }

    async function bfsHelper(node) {
      let BFSOrder = '';
      const q = new Queue();
      q.enqueue(new Pair(node, -1));
      vis[node] = true;
    
      async function processQueue() {
        while (!q.isEmpty()) {
          const frontNode = q.front().first;
          // console.log(q.front().first);
          
          if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
            document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          }
          if (document.querySelector(`#edge-${frontNode}${q.front().second}`)) {
            document.querySelector(`#edge-${frontNode}${q.front().second}`).style.stroke = lineColor;
          }
          document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
          BFSOrder += `${frontNode} `;
          setOutput(prevState => ({
            ...prevState,
            result: BFSOrder
          }));
          //this code is written by THREE
    
          for (let i = 0; i < adj[frontNode].length; i++) {
            if (vis[adj[frontNode][i]] === false) {
              q.enqueue(new Pair(adj[frontNode][i], frontNode));
              vis[adj[frontNode][i]] = true; 
            }
          }
    
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
    
      await processQueue(); // Start processing
    }

    async function dfsHelper(node, prev, DFSOrder){
      if(vis[node] === true){
        return;
      }

      await new Promise(resolve => setTimeout(resolve, speed));
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      DFSOrder.order += `${node} `;
      setOutput(prevState => ({
        ...prevState,
        result: DFSOrder.order
      }));

      for(let i = 0; i < adj[node].length; i++){
        await dfsHelper(adj[node][i], node, DFSOrder);
      }
    }

    async function bipartiteGraphHelper(node){
      const q = new Queue();
      q.enqueue(new Pair(node, -1));
      vis[node] = true;

      document.querySelector(`#node-${node}`).style.fill = 'blue';
      let nColor = 'rgb(50, 151, 106)';
      await new Promise(resolve => setTimeout(resolve, speed));
    
      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        //this code is written by THREE
  
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i]] === false) {
            if (document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`)) {
              document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`).style.stroke = lineColor;
            }
            if (document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`)) {
              document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`).style.stroke = lineColor;
            }
            document.querySelector(`#node-${adj[frontNode][i]}`).style.fill = nColor;
            q.enqueue(new Pair(adj[frontNode][i], frontNode));
            vis[adj[frontNode][i]] = true;
            await new Promise(resolve => setTimeout(resolve, speed));
          } else{
            if(document.getElementById(`node-${node}`).style.fill !== nColor){
              if (document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`)) {
                document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`).style.stroke = 'red';
              }
              if (document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`)) {
                document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`).style.stroke = 'red';
              }
              return [frontNode, adj[frontNode][i]];
            }
          }
        }
        
        nColor = (nColor === 'rgb(50, 151, 106)' ? 'blue' : 'rgb(50, 151, 106)');
        q.dequeue();
      }

      return [0];
    }
    
    if (algoSimulation === 'bfs') {
      setOutput(prevState => ({
        ...prevState,
        heading: 'One of the BFS Order:'
      }));
      async function performBFS() {
        await bfsHelper(startingNode);
        // for (let i = nodesIndexing; i < size; i++) {
        //   if (vis[i] === false) {
        //     await bfsHelper(i); // Use await to wait for the completion of bfsHelper
        //   }
        // }
        setDisableFunctions(false);
      }
    
      performBFS(); // Start BFS traversal
    }else if(algoSimulation === 'dfs'){
      setOutput(prevState => ({
        ...prevState,
        heading: 'One of the DFS Order:'
      }));
      async function performDFS() {
        let DFSOrder = {
          order: ''
        };
        await dfsHelper(startingNode, -1, DFSOrder);
        // for (let i = nodesIndexing; i < size; i++) {
        //   if (vis[i] === false) {
        //     await dfsHelper(i, -1); // Use await to wait for the completion of dfsHelper
        //   }
        // }
        setDisableFunctions(false);
      }
      //this code is written by THREE
      performDFS(); // Start DFS traversal
    }else if(algoSimulation === 'bipartiteGraph'){
      let flag = true;
      async function performBipartiteGraph() {
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            const ans = await bipartiteGraphHelper(i);
            if(ans.length === 2){
              setOutput({
                heading: 'Nope, not a Bipartite Graph',
                result: `Node ${ans[0]} and Node ${ans[1]} both have same Color`
              });
              flag = false;
              break;
            }
          }
        }

        if(flag){
          setOutput({
            heading: 'Yes, It is a Bipartite Graph',
            reslut: ''
          });
        }
        
        setDisableFunctions(false);
      }
      //this code is written by THREE
      performBipartiteGraph();
    }
  }else{
    // Making Adjecency List
    for(let i = 0; i < data.links.length; i++){
      const sourceId = parseInt(data.links[i].source.id);
      const targetId = parseInt(data.links[i].target.id);
      adj[sourceId].push(targetId);
    }

    async function bfsHelper(node) {
      let BFSOrder = '';
      const q = new Queue();
      q.enqueue(new Pair(node, -1));
      vis[node] = true;
    
      async function processQueue() {
        while (!q.isEmpty()) {
          const frontNode = q.front().first;
          
          if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
            document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          }
          if (document.getElementById(`arrow-${q.front().second}${frontNode}`)){
            document.getElementById(`arrow-${q.front().second}${frontNode}`).style.fill = 'white';
          }
          document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
          BFSOrder += `${frontNode} `;
          setOutput(prevState => ({
            ...prevState,
            result: BFSOrder
          }));
          //this code is written by THREE
    
          for (let i = 0; i < adj[frontNode].length; i++) {
            if (vis[adj[frontNode][i]] === false) {
              q.enqueue(new Pair(adj[frontNode][i], frontNode));
              vis[adj[frontNode][i]] = true;
            }
          }
    
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, speed)); // Wait for 0.5 second
        }
      }
    
      await processQueue(); // Start processing
    }

    async function dfsHelper(node, prev, DFSOrder){
      if(vis[node] === true){
        return;
      }

      await new Promise(resolve => setTimeout(resolve, speed));
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
      }
      if (document.getElementById(`arrow-${prev}${node}`)){
        document.getElementById(`arrow-${prev}${node}`).style.fill = 'white';
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      DFSOrder.order += `${node} `;
      setOutput(prevState => ({
        ...prevState,
        result: DFSOrder.order
      }));

      for(let i = 0; i < adj[node].length; i++){
        await dfsHelper(adj[node][i], node, DFSOrder);
      }
    }

    async function topoSortHelper(indegree){
      let s = '';
      let size = adj.length;
      let q = new Queue();
      for(let i = nodesIndexing; i < size; i++){
        if(indegree[i] === 0){
          q.enqueue(new Pair(i, -1));
        }
      }

      async function processQueue() {
        while(!q.isEmpty()){
          const frontNode = q.front().first;
          
          if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
            document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          }
          if (document.getElementById(`arrow-${q.front().second}${frontNode}`)){
            document.getElementById(`arrow-${q.front().second}${frontNode}`).style.fill = 'white';
          }
          document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;

          for(let i = 0; i < adj[q.front().first].length; i++){
            indegree[adj[q.front().first][i]]--;
            if(indegree[adj[q.front().first][i]] === 0){
              q.enqueue(new Pair(adj[q.front().first][i], q.front().first));
            }
          }
  
          s += `${q.front().first} `;
          setOutput(prevState => ({
            ...prevState,
            result: s
          }));
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
      
      await processQueue();
    }

    if(algoSimulation === 'bfs'){
      setOutput(prevState => ({
        ...prevState,
        heading: 'One of the BFS Order:'
      }));
      async function performBFS() {
        await bfsHelper(startingNode);
        // for (let i = nodesIndexing; i < size; i++) {
        //   if (vis[i] === false) {
        //     await bfsHelper(i); // Use await to wait for the completion of bfsHelper
        //   }
        // }//THREE
        setDisableFunctions(false);
      }
    
      performBFS();
    }else if(algoSimulation === 'dfs'){
      setOutput(prevState => ({
        ...prevState,
        heading: 'One of the DFS Order:'
      }));
      async function performDFS() {
        let DFSOrder = {
          order: ''
        };
        await dfsHelper(startingNode, -1, DFSOrder);
        // for (let i = nodesIndexing; i < size; i++) {
        //   if (vis[i] === false) {
        //     await dfsHelper(i, -1); // Use await to wait for the completion of dfsHelper
        //   }
        // }
        setDisableFunctions(false);
      }
      //this code is written by THREE
      performDFS(); // Start DFS traversal
    }else if(algoSimulation === 'topoSort'){
      async function performTopoSort() {
        const checkCycle = detectCycleDirectedGraph(adj, nodesIndexing);
        if(checkCycle[0] === true){
          setOutput({
            heading: 'It is not Directed Acyclic Graph (DAG)',
            result: `Can't find the Topological Sort for the given Graph`
          });
          console.log(`It is not Directed Acyclic Graph (DAG), Can't find the Topological Sort for the given Graph`);
        }else{
          setOutput(prevState => ({
            ...prevState,
            heading: 'One of the Topological Sort Order:'
          }));
          await topoSortHelper(checkCycle[1])
          // console.log(await topoSortHelper(checkCycle[1]));
        }
        setDisableFunctions(false);
      }
    
      performTopoSort();
    }
  }
}
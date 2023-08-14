class Stack {
  constructor() {
      this.items = [];
  }

  push(item) {
      this.items.push(item);
  }

  pop() {
      if (this.isEmpty()) {
          return undefined;
      }
      return this.items.pop();
  }

  top() {
      if (this.isEmpty()) {
          return undefined;
      }
      return this.items[this.items.length - 1];
  }

  isEmpty() {
      return this.items.length === 0;
  }

  size() {
      return this.items.length;
  }
}

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
      if(indegree[adj[q.front()][i]] == 0){
        q.enqueue(adj[q.front()][i]);
      }
    }

    q.dequeue();
  }

  for(let i = nodesIndexing; i < size; i++){
    if(indegree[i] != 0){
      return [true];
    }
  }

  return [false, anotherIndegree];
}

export function algorithms(graphType, algoSimulation, data, nodesIndexing, startingNode, setDisableFunctions) {
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
  const waitTime = 1000;
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
          //this code is written by THREE
          // vis[frontNode] = true;
          // console.log(vis[frontNode]);
    
          for (let i = 0; i < adj[frontNode].length; i++) {
            if (vis[adj[frontNode][i]] === false) {
              q.enqueue(new Pair(adj[frontNode][i], frontNode));
              vis[adj[frontNode][i]] = true; 
            }
          }
    
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    
      await processQueue(); // Start processing
    }

    async function dfsHelper(node, prev){
      if(vis[node] === true){
        return;
      }

      await new Promise(resolve => setTimeout(resolve, waitTime));
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;

      for(let i = 0; i < adj[node].length; i++){
        await dfsHelper(adj[node][i], node);
      }
    }

    async function bipartiteGraphHelper(node, prev, nColor){
      if(vis[node] === true){
        if(document.getElementById(`node-${node}`).style.fill !== nColor){
          if (document.querySelector(`#edge-${prev}${node}`)) {
            document.querySelector(`#edge-${prev}${node}`).style.stroke = 'red';
          }
          if (document.querySelector(`#edge-${node}${prev}`)) {
            document.querySelector(`#edge-${node}${prev}`).style.stroke = 'red';
          }
          return -1;
        }
        return 0;
      }

      await new Promise(resolve => setTimeout(resolve, waitTime));
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
      }
      document.querySelector(`#node-${node}`).style.fill = nColor;

      for(let i = 0; i < adj[node].length; i++){
        const ans = await bipartiteGraphHelper(adj[node][i], node, (nColor === 'rgb(50, 151, 106)' ? 'blue' : 'rgb(50, 151, 106)'));
        if(ans !== 0){
          if (ans.length === undefined){
            return [node, adj[node][i]];
          }
          return ans;
        }
      }

      return 0;
    }
    
    if (algoSimulation === 'bfs') {
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
      async function performDFS() {
        await dfsHelper(startingNode, -1);
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
      async function performBipartiteGraph() {
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            const ans = await bipartiteGraphHelper(i, -1, 'rgb(50, 151, 106)');
            if(ans.length === 2){
              console.log(ans[0], ans[1]);
              break;
            }
          }
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
          //this code is written by THREE
    
          for (let i = 0; i < adj[frontNode].length; i++) {
            if (!vis[adj[frontNode][i]]) {
              q.enqueue(new Pair(adj[frontNode][i], frontNode));
              vis[node] = true;
            }
          }
    
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait for 0.5 second
        }
      }
    
      await processQueue(); // Start processing
    }

    async function dfsHelper(node, prev){
      if(vis[node] === true){
        return;
      }

      await new Promise(resolve => setTimeout(resolve, waitTime));
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
      }
      if (document.getElementById(`arrow-${prev}${node}`)){
        document.getElementById(`arrow-${prev}${node}`).style.fill = 'white';
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;

      for(let i = 0; i < adj[node].length; i++){
        await dfsHelper(adj[node][i], node);
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
            if(indegree[adj[q.front().first][i]] == 0){
              q.enqueue(new Pair(adj[q.front().first][i], q.front().first));
            }
          }
  
          s += `${q.front().first} `;
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      
      await processQueue();
      return s;
    }

    if(algoSimulation === 'bfs'){
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
      async function performDFS() {
        await dfsHelper(startingNode, -1);
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
          console.log(`It is not Directed Acyclic Graph (DAG), Can't find the Topological Sort for the given Graph`);
        }else{
          console.log(await topoSortHelper(checkCycle[1]));
        }
        setDisableFunctions(false);
      }
    
      performTopoSort();
    }
  }
}
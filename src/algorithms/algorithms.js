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


export function algorithms(graphType, algoSimulation, data, nodesIndexing, startingNode, setDisableFunctions) {
  const circles = document.querySelectorAll('svg circle');
  circles.forEach(circle => {
    circle.style.fill = 'red';
  });
  const lines = document.querySelectorAll('svg line');
  lines.forEach(line => {
    line.style.stroke = 'orange';
  });
  const lineColor = '#F2F1F1';
  const nodeColor = '#32976A';
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
    
      async function processQueue() {
        while (!q.isEmpty()) {
          const frontNode = q.front().first;
          
          if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
            document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          }
          if (document.querySelector(`#edge-${frontNode}${q.front().second}`)) {
            document.querySelector(`#edge-${frontNode}${q.front().second}`).style.stroke = lineColor;
          }
          document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
          //this code is written by THREE
          vis[frontNode] = true;
    
          for (let i = 0; i < adj[frontNode].length; i++) {
            if (!vis[adj[frontNode][i]]) {
              q.enqueue(new Pair(adj[frontNode][i], frontNode));
            }
          }
    
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 0.5 second
        }
      }
    
      await processQueue(); // Start processing
    }

    async function dfsHelper(node, prev){
      if(vis[node] === true){
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
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

      // await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (algoSimulation === 'bfs') {
      async function performBFS() {
        await bfsHelper(startingNode);
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            await bfsHelper(i); // Use await to wait for the completion of bfsHelper
          }
        }
        setDisableFunctions(false);
      }
    
      performBFS(); // Start BFS traversal
    }
    
    if(algoSimulation === 'dfs'){
      async function performDFS() {
        await dfsHelper(startingNode);
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            await dfsHelper(i); // Use await to wait for the completion of dfsHelper
          }
        }
        setDisableFunctions(false);
      }
      //this code is written by THREE
      performDFS(); // Start DFS traversal
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
          vis[frontNode] = true;
    
          for (let i = 0; i < adj[frontNode].length; i++) {
            if (!vis[adj[frontNode][i]]) {
              q.enqueue(new Pair(adj[frontNode][i], frontNode));
            }
          }
    
          q.dequeue();
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 0.5 second
        }
      }
    
      await processQueue(); // Start processing
    }

    if(algoSimulation == 'bfs'){
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
    }
    // console.log('directedGraph', adj);
  }
}
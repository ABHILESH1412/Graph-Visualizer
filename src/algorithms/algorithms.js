const lineColor = '#F2F1F1';
const nodeColor = 'rgb(50, 151, 106)';
const queueColor = '#9067B6';

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

class Triplet {
  constructor(first, second, third){
    this.first = first;
    this.second = second;
    this.third = third;
  }
}

// This priority queue will not work for interger or float, it will only work for Pair and Triplet
class PriorityQueue {
  constructor() {
      this.heap = [];
  }

  getParentIndex(index) {
      return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
      return 2 * index + 1;
  }

  getRightChildIndex(index) {
      return 2 * index + 2;
  }

  swap(index1, index2) {
      [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  push(pair) {
      this.heap.push(pair);
      this.heapifyUp();
  }

  heapifyUp() {
      let index = this.heap.length - 1;
      while (this.getParentIndex(index) >= 0 && this.heap[this.getParentIndex(index)].first > this.heap[index].first) {
          this.swap(this.getParentIndex(index), index);
          index = this.getParentIndex(index);
      }
  }

  pop() {
      if (this.heap.length === 1) return this.heap.pop();
      const root = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
      return root;
  }

  heapifyDown() {
      let index = 0;
      while (this.getLeftChildIndex(index) < this.heap.length) {
          let smallerChildIndex = this.getLeftChildIndex(index);
          if (this.getRightChildIndex(index) < this.heap.length && this.heap[this.getRightChildIndex(index)].first < this.heap[smallerChildIndex].first) {
              smallerChildIndex = this.getRightChildIndex(index);
          }
          if (this.heap[index].first < this.heap[smallerChildIndex].first) break;
          this.swap(index, smallerChildIndex);
          index = smallerChildIndex;
      }
  }

  front() {
      return this.heap[0];
  }

  isEmpty() {
      return this.heap.length === 0;
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

function recordSteps(finalGraph, stepNumber, tempGraph){
  finalGraph[stepNumber] = {
    ...tempGraph
  };
}

function changeLink(tempGraph, source, target, color){
  tempGraph.links = tempGraph.links.map((link) => {
    if(link.source.id == source && link.target.id == target){
      link = {
        ...link,
        color: color
      }
    }

    return link;
  })
}

function changeNode(tempGraph, currNode, color){
  tempGraph.nodes = tempGraph.nodes.map((node) => {
    if(node.id == currNode){
      node = {
        ...node,
        color: color
      }
    }

    return node;
  });
}


export function algorithms(graphType, algoSimulation, data, nodesIndexing, startingNode, destNode, setDisableFunctions, speed, setOutput, setSteps) {
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
  });

  let stepNumber = 0;
  let finalGraph = {};
  let tempGraph = {
    ...data
  };
  tempGraph.nodes = tempGraph.nodes.map((node) => {
    node = {
      ...node,
      color: 'red'
    }
    return node;
  });
  tempGraph.links = tempGraph.links.map((link) => {
    link = {
      ...link,
      color: 'orange'
    }
    return link;
  });
  recordSteps(finalGraph, stepNumber++, tempGraph);

  // const pinkColor = '#FFB8CE';
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

      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        // console.log(q.front().first);
        
        if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
          document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          changeLink(tempGraph, q.front().second, frontNode, lineColor);
        }
        if (document.querySelector(`#edge-${frontNode}${q.front().second}`)) {
          document.querySelector(`#edge-${frontNode}${q.front().second}`).style.stroke = lineColor;
          changeLink(tempGraph, frontNode, q.front().second, lineColor);
        }
        document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
        changeNode(tempGraph, frontNode, nodeColor);
        tempGraph.nodes = tempGraph.nodes.map((node) => {
          if(node.id == frontNode){
            node = {
              ...node,
              color: nodeColor
            }
          }

          return node;
        })
        recordSteps(finalGraph, stepNumber++, tempGraph);

        BFSOrder += `${frontNode} `;
        setOutput(prevState => ({
          ...prevState,
          result: BFSOrder
        }));
        //this code is written by THREE
        
        // await new Promise(resolve => setTimeout(resolve, speed * 0.5));
        let flag = false;
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i]] === false) {
            q.enqueue(new Pair(adj[frontNode][i], frontNode));
            vis[adj[frontNode][i]] = true; 
            document.querySelector(`#node-${adj[frontNode][i]}`).style.fill = queueColor;
            changeNode(tempGraph, adj[frontNode][i], queueColor);
            tempGraph.nodes = tempGraph.nodes.map((node) => {
              if(node.id == adj[frontNode][i]){
                node = {
                  ...node,
                  color: queueColor
                }
              }
              return node;
            })
            flag = true;
          }
        }
        if(flag){
          recordSteps(finalGraph, stepNumber++, tempGraph);
        }
        
        q.dequeue();
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    async function shortestPathHelper(dist, parent) {
      const q = new Queue();
      q.enqueue(new Pair(startingNode, -1));
      vis[startingNode] = true;

      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        
        if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
          document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          changeLink(tempGraph, q.front().second, frontNode, lineColor);
        }
        if (document.querySelector(`#edge-${frontNode}${q.front().second}`)) {
          document.querySelector(`#edge-${frontNode}${q.front().second}`).style.stroke = lineColor;
          changeLink(tempGraph, frontNode, q.front().second, lineColor);
        }
        document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
        changeNode(tempGraph, frontNode, nodeColor);

        tempGraph.nodes = tempGraph.nodes.map((node) => {
          if(node.id == frontNode){
            node = {
              ...node,
              color: nodeColor
            }
          }

          return node;
        })
        recordSteps(finalGraph, stepNumber++, tempGraph);

        if(frontNode == destNode){
          break;
        }
  
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i]] === false) {
            q.enqueue(new Pair(adj[frontNode][i], frontNode));
            vis[adj[frontNode][i]] = true; 
            parent[adj[frontNode][i]] = frontNode;
            dist[adj[frontNode][i]] = dist[frontNode] + 1;
          }
        }
  
        q.dequeue();
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    async function dfsHelper(node, prev, DFSOrder){
      if(vis[node] === true){
        return;
      }

      if(prev !== -1){
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
        changeLink(tempGraph, node, prev, lineColor);
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);
      recordSteps(finalGraph, stepNumber++, tempGraph);
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
      let nodeColors = new Array(size).fill(-1);
      nodeColors[node] = 0;
      vis[node] = true;

      document.querySelector(`#node-${node}`).style.fill = 'blue';
      changeNode(tempGraph, node, 'blue');
      // let nColor = 'rgb(50, 151, 106)';
      recordSteps(finalGraph, stepNumber++, tempGraph);
      await new Promise(resolve => setTimeout(resolve, speed));
    
      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        //this code is written by THREE
  
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i]] === false) {
            if (document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`)) {
              document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`).style.stroke = lineColor;
              changeLink(tempGraph, adj[frontNode][i], frontNode, lineColor);
            }
            if (document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`)) {
              document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`).style.stroke = lineColor;
              changeLink(tempGraph, frontNode, adj[frontNode][i], lineColor);
            }
            document.querySelector(`#node-${adj[frontNode][i]}`).style.fill = (nodeColors[frontNode] === 1 ? 'blue' : 'rgb(50, 151, 106)');
            changeNode(tempGraph, adj[frontNode][i], (nodeColors[frontNode] === 1 ? 'blue' : 'rgb(50, 151, 106)'));
            q.enqueue(new Pair(adj[frontNode][i], frontNode));
            nodeColors[adj[frontNode][i]] = (nodeColors[frontNode] === 1 ? 2 : 1);
            vis[adj[frontNode][i]] = true;
            recordSteps(finalGraph, stepNumber++, tempGraph);
            await new Promise(resolve => setTimeout(resolve, speed));
          } else{
            if(nodeColors[adj[frontNode][i]] === nodeColors[frontNode]){
              if (document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`)) {
                document.querySelector(`#edge-${frontNode}${adj[frontNode][i]}`).style.stroke = 'red';
                changeLink(tempGraph, frontNode, adj[frontNode][i], 'red');
              }
              if (document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`)) {
                document.querySelector(`#edge-${adj[frontNode][i]}${frontNode}`).style.stroke = 'red';
                changeLink(tempGraph, adj[frontNode][i], frontNode, 'red');
              }
              recordSteps(finalGraph, stepNumber++, tempGraph);
              return [frontNode, adj[frontNode][i]];
            }
          }
        }
        
        // nColor = (nColor === 'rgb(50, 151, 106)' ? 'blue' : 'rgb(50, 151, 106)');
        q.dequeue();
      }

      return [0];
    }

    async function detectCycleHelper(node, prev, cycleNodes){
      if(vis[node] === true){
        // console.log('Cycle Exist');
        await new Promise(resolve => setTimeout(resolve, speed));
        return [true, node, false];
      }

      await new Promise(resolve => setTimeout(resolve, speed));
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
        changeLink(tempGraph, node, prev, lineColor);
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);

      changeNode(tempGraph, node, nodeColor);
      recordSteps(finalGraph, stepNumber++, tempGraph);

      for(let i = 0; i < adj[node].length; i++){
        //If the current node is th prev node
        if(prev === adj[node][i]){
          continue;
        }

        const tempVar = await detectCycleHelper(adj[node][i], node, cycleNodes);
        //If cycle doesn't exist we continue with the algo
        if(!tempVar[0]){
          continue;
        }
        
        //This condition keeps on adding the nodes in the string till we find out that we have reached to the node, at which we came to know that there exists a cycle in the graph, So that we can show which nodes make the cycle in the graph in order.
        if(!tempVar[2]){
          cycleNodes.nodes.push(node);
          // cycleNodes.nodes = `${node} ` + cycleNodes.nodes;
          // setOutput(prevState => ({
          //   ...prevState,
          //   result: cycleNodes.nodes
          // }));
        }
        //If we have reaced to that node, at which we came to know that there exists a cycle in the graph
        if(node == tempVar[1]){
          tempVar[2] = true;
        }

        return [true, tempVar[1], tempVar[2]];
      }

      return [false];
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
        setSteps(finalGraph);
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
        setSteps(finalGraph);
      }
      //this code is written by THREE
      performDFS(); // Start DFS traversal
    }else if(algoSimulation === 'bipartiteGraph'){
      setOutput(prevState => ({
        ...prevState,
        note: 'BFS algorithm is used to detect Bipartite Graph.',
      }));
      let flag = true;
      async function performBipartiteGraph() {
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            const ans = await bipartiteGraphHelper(i);
            if(ans.length === 2){
              setOutput( prevState =>({
                ...prevState,
                heading: 'Nope, not a Bipartite Graph',
                result: `Node ${ans[0]} and Node ${ans[1]} both have same Color`
              }));
              flag = false;
              break;
            }
          }
        }

        if(flag){
          setOutput( prevState => ({
            ...prevState,
            heading: 'Yes, It is a Bipartite Graph',
            reslut: ''
          }));
        }
        
        setDisableFunctions(false);
        setSteps(finalGraph);
      }
      //this code is written by THREE
      performBipartiteGraph();
    }else if(algoSimulation === 'detectCycle'){
      // console.log('Detect Cycle Function');
      setOutput(prevState => ({
        ...prevState,
        note: 'DFS algorithm is used to detect cycle in the graph.',
      }));
      async function performDFS() {
        let flag = [false];
        let cycleNodes = {
          nodes: []
        };
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            flag = await detectCycleHelper(i, -1, cycleNodes);
            // If cycle exists in the graph
            if(flag[0]){
              setOutput(prevState => ({
                ...prevState,
                heading: 'Cycle Detected'
              }));
              
              let firstNode = cycleNodes.nodes[0], secondNode, outputString = `${cycleNodes.nodes[cycleNodes.nodes.length-1]} `;
              for(let j = 1; j < cycleNodes.nodes.length; j++){
                outputString += `${cycleNodes.nodes[cycleNodes.nodes.length-j-1]} `;
                secondNode = cycleNodes.nodes[j];
                if (document.querySelector(`#edge-${firstNode}${secondNode}`)) {
                  document.querySelector(`#edge-${firstNode}${secondNode}`).style.stroke = 'red';
                  changeLink(tempGraph, firstNode, secondNode, 'red');
                }
                if (document.querySelector(`#edge-${secondNode}${firstNode}`)) {
                  document.querySelector(`#edge-${secondNode}${firstNode}`).style.stroke = 'red';
                  changeLink(tempGraph, secondNode, firstNode, 'red');
                }
                firstNode = secondNode;
              }
              firstNode = cycleNodes.nodes[0];
              secondNode = cycleNodes.nodes[cycleNodes.nodes.length-1];
              if (document.querySelector(`#edge-${firstNode}${secondNode}`)) {
                document.querySelector(`#edge-${firstNode}${secondNode}`).style.stroke = 'red';
                changeLink(tempGraph, firstNode, secondNode, 'red');
              }
              if (document.querySelector(`#edge-${secondNode}${firstNode}`)) {
                document.querySelector(`#edge-${secondNode}${firstNode}`).style.stroke = 'red';
                changeLink(tempGraph, secondNode, firstNode, 'red');
              }
              
              recordSteps(finalGraph, stepNumber++, tempGraph);
              setOutput(prevState => ({
                ...prevState,
                result: outputString
              }));
              
              break;
            }
          }
        }
        if(!flag[0]){
          setOutput(prevState => ({
            ...prevState,
            heading: 'No Cycle exists in the given Graph'
          }));
          // console.log('No Cycle Exist');
        }
        setDisableFunctions(false);
        setSteps(finalGraph);
        // console.log(finalGraph);
      }
      //this code is written by THREE
      performDFS();
    }else if(algoSimulation === 'shortestPath'){
      setOutput(prevState => ({
        ...prevState,
        note: `1) The weight of the each edge is assumed to be 1 unit.

        2) BFS algorithm is used to find the shortest path.`,
      }));
      async function performBFS() {
        let parent = [];
        for(let i = 0; i < size; i++){
          parent[i] = i;
        }
        let dist = new Array(size).fill(Infinity);
        dist[startingNode] = 0;

        await shortestPathHelper(dist, parent);
        if(dist[destNode] === Infinity){
          setOutput(prevState => ({
            ...prevState,
            heading: `No path exists from ${startingNode} to ${destNode}`
          }));
        }else{
          let idx = destNode;
          let path = [];
          while(parent[idx] != idx){
            path.push(idx);
            document.querySelector(`#node-${idx}`).style.fill = 'blue';
            changeNode(tempGraph, idx, 'blue');
            idx = parent[idx];
          }
          path.push(idx);
          document.querySelector(`#node-${idx}`).style.fill = 'blue';
          changeNode(tempGraph, idx, 'blue');

          for(let i = 0; i < path.length/2; i++){
            let temp = path[i];
            path[i] = path[path.length-1-i];
            path[path.length-1-i] = temp;
          }

          for(let i = 0; i < path.length-1; i++){
            if (document.querySelector(`#edge-${path[i]}${path[i+1]}`)) {
              document.querySelector(`#edge-${path[i]}${path[i+1]}`).style.stroke = 'blue';
              changeLink(tempGraph, path[i], path[i+1], 'blue');
            }
            if (document.querySelector(`#edge-${path[i+1]}${path[i]}`)) {
              document.querySelector(`#edge-${path[i+1]}${path[i]}`).style.stroke = 'blue';
              changeLink(tempGraph, path[i+1], path[i], 'blue');
            }
          }
          
          recordSteps(finalGraph, stepNumber++, tempGraph);

          let s = "";

          for(let i = 0; i < path.length; i++){
            s += path[i];

            if(i != path.length-1){
              s += " -> ";
            }
          }

          setOutput(prevState => ({
            ...prevState,
            heading: `Shortest path`,
            result: `Path Length: ${dist[destNode]} units
            
            Path: ${s}`
          }));
        }
        // for (let i = nodesIndexing; i < size; i++) {
        //   if (vis[i] === false) {
        //     await bfsHelper(i); // Use await to wait for the completion of bfsHelper
        //   }
        // }
        setDisableFunctions(false);
        setSteps(finalGraph);
      }
    
      performBFS(); // Start BFS traversal
    }
  }else if(graphType === 'directedGraph') {
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
    
      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        
        if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
          document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          changeLink(tempGraph, q.front().second, frontNode, lineColor);
        }
        if (document.getElementById(`arrow-${q.front().second}${frontNode}`)){
          document.getElementById(`arrow-${q.front().second}${frontNode}`).style.fill = 'white';
        }
        document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
        changeNode(tempGraph, frontNode, nodeColor);
        recordSteps(finalGraph, stepNumber++, tempGraph);
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
    async function shortestPathHelper(dist, parent) {
      const q = new Queue();
      q.enqueue(new Pair(startingNode, -1));
      vis[startingNode] = true;
    
      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        
        if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
          document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          changeLink(tempGraph, q.front().second, frontNode, lineColor);
        }
        if (document.getElementById(`arrow-${q.front().second}${frontNode}`)){
          document.getElementById(`arrow-${q.front().second}${frontNode}`).style.fill = 'white';
        }
        document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
        changeNode(tempGraph, frontNode, nodeColor);
        recordSteps(finalGraph, stepNumber++, tempGraph);

        if(frontNode == destNode){
          break;
        }

        //this code is written by THREE
  
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i]] === false) {
            q.enqueue(new Pair(adj[frontNode][i], frontNode));
            vis[adj[frontNode][i]] = true;
            parent[adj[frontNode][i]] = frontNode;
            dist[adj[frontNode][i]] = dist[frontNode] + 1;
          }
        }
  
        q.dequeue();
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    async function dfsHelper(node, prev, DFSOrder){
      if(vis[node] === true){
        return;
      }

      if(prev !== -1){
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.getElementById(`arrow-${prev}${node}`)){
        document.getElementById(`arrow-${prev}${node}`).style.fill = 'white';
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);
      recordSteps(finalGraph, stepNumber++, tempGraph);
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
            changeLink(tempGraph, q.front().second, frontNode, lineColor);
          }
          if (document.getElementById(`arrow-${q.front().second}${frontNode}`)){
            document.getElementById(`arrow-${q.front().second}${frontNode}`).style.fill = 'white';
          }
          document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
          changeNode(tempGraph, frontNode, nodeColor);
          recordSteps(finalGraph, stepNumber++, tempGraph);

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

    async function detectCycleHelper(node, prev, cycleNodes, anotherVis){
      if(anotherVis[node] === true){
        // console.log('Cycle Exist');
        await new Promise(resolve => setTimeout(resolve, speed));
        cycleNodes.nodes.push(node);
        return [true, node, false];
      }
      if(vis[node] === true){
        return [false];
      }

      await new Promise(resolve => setTimeout(resolve, speed));
      vis[node] = true;
      anotherVis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.getElementById(`arrow-${prev}${node}`)){
        document.getElementById(`arrow-${prev}${node}`).style.fill = 'white';
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);

      changeNode(tempGraph, node, nodeColor);
      recordSteps(finalGraph, stepNumber++, tempGraph);

      for(let i = 0; i < adj[node].length; i++){
        //If the current node is th prev node
        // if(prev === adj[node][i]){
        //   continue;
        // }

        const tempVar = await detectCycleHelper(adj[node][i], node, cycleNodes, anotherVis);
        //If cycle doesn't exist we continue with the algo
        if(!tempVar[0]){
          continue;
        }
        
        //If we have reaced to that node, at which we came to know that there exists a cycle in the graph
        if(node == tempVar[1]){
          cycleNodes.nodes.push(node);
          tempVar[2] = true;
        }

        //This condition keeps on adding the nodes in the string till we find out that we have reached to the node, at which we came to know that there exists a cycle in the graph, So that we can show which nodes make the cycle in the graph in order.
        if(!tempVar[2]){
          cycleNodes.nodes.push(node);
        }

        return [true, tempVar[1], tempVar[2]];
      }
      anotherVis[node] = false;

      return [false];
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
        setSteps(finalGraph);
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
        setSteps(finalGraph);
      }
      //this code is written by THREE
      performDFS(); // Start DFS traversal
    }else if(algoSimulation === 'topoSort'){
      setOutput(prevState => ({
        ...prevState,
        note: `BFS (Kahn's Algorithm) is used to find the Topological Sort.`,
      }));
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
          setSteps(finalGraph);
          // console.log(await topoSortHelper(checkCycle[1]));
        }
        setDisableFunctions(false);
      }
    
      performTopoSort();
    }else if(algoSimulation === 'detectCycle'){
      // console.log('Detect Cycle Function');
      setOutput(prevState => ({
        ...prevState,
        note: `DFS algorithm is used to detect cycle.`,
      }));
      async function performDFS() {
        let flag = [false];
        let cycleNodes = {
          nodes: []
        };
        let anotherVis = Array.from({ length: size }).fill(false);
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            flag = await detectCycleHelper(i, -1, cycleNodes, anotherVis);

            //If cycle detected
            if(flag[0]){
              setOutput(prevState => ({
                ...prevState,
                heading: 'Cycle Detected'
              }));
              
              let firstNode = cycleNodes.nodes[0], secondNode, outputString = `${cycleNodes.nodes[cycleNodes.nodes.length-1]} `;
              for(let j = 1; j < cycleNodes.nodes.length; j++){
                if(j < cycleNodes.nodes.length-1){
                  outputString += `${cycleNodes.nodes[cycleNodes.nodes.length-j-1]} `;
                }
                
                secondNode = cycleNodes.nodes[j];
                document.querySelector(`#edge-${secondNode}${firstNode}`).style.stroke = 'red';
                changeLink(tempGraph, secondNode, firstNode, 'red');
                document.getElementById(`arrow-${secondNode}${firstNode}`).style.fill = 'red';
                // if (document.querySelector(`#edge-${firstNode}${secondNode}`)) {
                //   document.querySelector(`#edge-${firstNode}${secondNode}`).style.stroke = 'red';
                //   changeLink(tempGraph, firstNode, secondNode, lineColor);
                // }
                // if (document.querySelector(`#edge-${secondNode}${firstNode}`)) {
                //   document.querySelector(`#edge-${secondNode}${firstNode}`).style.stroke = 'red';
                //   changeLink(tempGraph, secondNode, firstNode, lineColor);
                // }
                firstNode = secondNode;
              }
              
              recordSteps(finalGraph, stepNumber++, tempGraph);
              setOutput(prevState => ({
                ...prevState,
                result: outputString
              }));
              
              break;
            }
          }
        }
        if(!flag[0]){
          setOutput(prevState => ({
            ...prevState,
            heading: 'No Cycle exists in the given Graph'
          }));
          // console.log('No Cycle Exist');
        }
        setDisableFunctions(false);
        setSteps(finalGraph);
        // console.log(finalGraph);
      }
      //this code is written by THREE
      performDFS();
    }else if(algoSimulation === 'shortestPath'){
      setOutput(prevState => ({
        ...prevState,
        note: `1) The weight of the each edge is assumed to be 1.

        2) BFS algorithm is used to detect cycle.`,
      }));
      async function performBFS() {
        let parent = [];
        for(let i = 0; i < size; i++){
          parent[i] = i;
        }
        let dist = new Array(size).fill(Infinity);
        dist[startingNode] = 0;

        await shortestPathHelper(dist, parent);
        if(dist[destNode] === Infinity){
          setOutput(prevState => ({
            ...prevState,
            heading: `No path exists from ${startingNode} to ${destNode}`
          }));
        }else{
          let idx = destNode;
          let path = [];

          // Creating the path from source node to destination node using parent array and changing the color of those nodes and the colour of the edges between each pair of nodes in the path.
          while(parent[idx] != idx){
            path.push(idx);
            changeNode(tempGraph, idx, 'blue');
            document.querySelector(`#node-${idx}`).style.fill = 'blue';
            idx = parent[idx];
          }
          path.push(idx);
          changeNode(tempGraph, idx, 'blue');
          document.querySelector(`#node-${idx}`).style.fill = 'blue';

          for(let i = 0; i < path.length/2; i++){
            let temp = path[i];
            path[i] = path[path.length-1-i];
            path[path.length-1-i] = temp;
          }
          for(let i = 0; i < path.length-1; i++){
            changeLink(tempGraph, path[i], path[i+1], 'blue');
            document.querySelector(`#edge-${path[i]}${path[i+1]}`).style.stroke = 'blue';
            document.getElementById(`arrow-${path[i]}${path[i+1]}`).style.fill = 'blue';
          }
          recordSteps(finalGraph, stepNumber++, tempGraph);

          let s = "";

          for(let i = 0; i < path.length; i++){
            s += path[i];

            if(i != path.length-1){
              s += " -> ";
            }
          }

          setOutput(prevState => ({
            ...prevState,
            heading: `Shortest path`,
            result: `Path Length: ${dist[destNode]} units
            
            Path: ${s}`
          }));
        }

        setDisableFunctions(false);
        setSteps(finalGraph);
      }
    
      performBFS(); // Start BFS traversal
    }
  }else if(graphType === 'undirectedWeightedGraph'){
    // Making Adjecency List
    for(let i = 0; i < data.links.length; i++){
      const sourceId = parseInt(data.links[i].source.id);
      const targetId = parseInt(data.links[i].target.id);
      const weight = parseInt(data.links[i].weight);
      adj[sourceId].push(new Pair(targetId, weight));
      adj[targetId].push(new Pair(sourceId, weight));
    }
    // setDisableFunctions(false);

    async function dfsHelper(node, prev, DFSOrder){
      if(vis[node] === true){
        return;
      }

      if(prev !== -1){
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
        changeLink(tempGraph, node, prev, lineColor);
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);
      recordSteps(finalGraph, stepNumber++, tempGraph);
      DFSOrder.order += `${node} `;
      setOutput(prevState => ({
        ...prevState,
        result: DFSOrder.order
      }));

      for(let i = 0; i < adj[node].length; i++){
        await dfsHelper(adj[node][i].first, node, DFSOrder);
      }
    }

    async function bfsHelper(node) {
      let BFSOrder = '';
      const q = new Queue();
      q.enqueue(new Pair(node, -1));
      vis[node] = true;

      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        // console.log(q.front().first);
        
        if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
          document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          changeLink(tempGraph, q.front().second, frontNode, lineColor);
        }
        if (document.querySelector(`#edge-${frontNode}${q.front().second}`)) {
          document.querySelector(`#edge-${frontNode}${q.front().second}`).style.stroke = lineColor;
          changeLink(tempGraph, frontNode, q.front().second, lineColor);
        }
        document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
        changeNode(tempGraph, frontNode, nodeColor);
        tempGraph.nodes = tempGraph.nodes.map((node) => {
          if(node.id == frontNode){
            node = {
              ...node,
              color: nodeColor
            }
          }

          return node;
        })
        recordSteps(finalGraph, stepNumber++, tempGraph);
        BFSOrder += `${frontNode} `;
        setOutput(prevState => ({
          ...prevState,
          result: BFSOrder
        }));
  
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i].first] === false) {
            q.enqueue(new Pair(adj[frontNode][i].first, frontNode));
            vis[adj[frontNode][i].first] = true; 
          }
        }
  
        q.dequeue();
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    async function bipartiteGraphHelper(node){
      const q = new Queue();
      q.enqueue(new Pair(node, -1));
      let nodeColors = new Array(size).fill(-1);
      nodeColors[node] = 0;
      vis[node] = true;

      document.querySelector(`#node-${node}`).style.fill = 'blue';
      changeNode(tempGraph, node, 'blue');
      // let nColor = 'rgb(50, 151, 106)';
      recordSteps(finalGraph, stepNumber++, tempGraph);
      await new Promise(resolve => setTimeout(resolve, speed));
    
      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        //this code is written by THREE
  
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i].first] === false) {
            if (document.querySelector(`#edge-${adj[frontNode][i].first}${frontNode}`)) {
              document.querySelector(`#edge-${adj[frontNode][i].first}${frontNode}`).style.stroke = lineColor;
              changeLink(tempGraph, adj[frontNode][i], frontNode, lineColor);
            }
            if (document.querySelector(`#edge-${frontNode}${adj[frontNode][i].first}`)) {
              document.querySelector(`#edge-${frontNode}${adj[frontNode][i].first}`).style.stroke = lineColor;
              changeLink(tempGraph, frontNode, adj[frontNode][i], lineColor);
            }
            document.querySelector(`#node-${adj[frontNode][i].first}`).style.fill = (nodeColors[frontNode] === 1 ? 'blue' : 'rgb(50, 151, 106)');
            changeNode(tempGraph, adj[frontNode][i].first, (nodeColors[frontNode] === 1 ? 'blue' : 'rgb(50, 151, 106)'));
            nodeColors[adj[frontNode][i].first] = (nodeColors[frontNode] === 1 ? 2 : 1);
            q.enqueue(new Pair(adj[frontNode][i].first, frontNode));
            vis[adj[frontNode][i].first] = true;
            recordSteps(finalGraph, stepNumber++, tempGraph);
            await new Promise(resolve => setTimeout(resolve, speed));
          } else{
            // if(document.getElementById(`node-${node}`).style.fill !== nColor)
            if(nodeColors[adj[frontNode][i].first] === nodeColors[frontNode]){
              if (document.querySelector(`#edge-${frontNode}${adj[frontNode][i].first}`)) {
                document.querySelector(`#edge-${frontNode}${adj[frontNode][i].first}`).style.stroke = 'red';
                changeLink(tempGraph, frontNode, adj[frontNode][i].first, 'red');
              }
              if (document.querySelector(`#edge-${adj[frontNode][i].first}${frontNode}`)) {
                document.querySelector(`#edge-${adj[frontNode][i].first}${frontNode}`).style.stroke = 'red';
                changeLink(tempGraph, adj[frontNode][i].first, frontNode, 'red');
              }
              recordSteps(finalGraph, stepNumber++, tempGraph);
              return [frontNode, adj[frontNode][i].first];
            }
          }
        }
        
        // nColor = (nColor === 'rgb(50, 151, 106)' ? 'blue' : 'rgb(50, 151, 106)');
        q.dequeue();
      }

      return [0];
    }

    async function detectCycleHelper(node, prev, cycleNodes){
      if(vis[node] === true){
        // console.log('Cycle Exist');
        await new Promise(resolve => setTimeout(resolve, speed));
        return [true, node, false];
      }

      await new Promise(resolve => setTimeout(resolve, speed));
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
        changeLink(tempGraph, node, prev, lineColor);
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);

      recordSteps(finalGraph, stepNumber++, tempGraph);

      for(let i = 0; i < adj[node].length; i++){
        //If the current node is th prev node
        if(prev === adj[node][i].first){
          continue;
        }

        const tempVar = await detectCycleHelper(adj[node][i].first, node, cycleNodes);
        //If cycle doesn't exist we continue with the algo
        if(!tempVar[0]){
          continue;
        }
        
        //This condition keeps on adding the nodes in the string till we find out that we have reached to the node, at which we came to know that there exists a cycle in the graph, So that we can show which nodes make the cycle in the graph in order.
        if(!tempVar[2]){
          cycleNodes.nodes.push(node);
        }
        //If we have reaced to that node, at which we came to know that there exists a cycle in the graph
        if(node == tempVar[1]){
          tempVar[2] = true;
        }

        return [true, tempVar[1], tempVar[2]];
      }

      return [false];
    }

    async function dijktraHelper(){
      let q = new PriorityQueue();
      let dist = new Array(size).fill(Infinity);
      dist[startingNode] = 0;
      q.push(new Triplet(0, startingNode, -1));
    
      let parentArray = new Array(size);
      for(let i = 0; i < size; i++){
        parentArray[i] = i;
      }
    
      setOutput(prevState => ({
        ...prevState,
        heading: `Minimum distance between ${startingNode} to every node`,
        table: {
          startingNode: nodesIndexing,
          dist: dist
        }
      }));
    
      while(!q.isEmpty()){
        const node = q.front().second;
        const distance = q.front().first;
        const prevNode = q.front().third;
        q.pop();
    
        document.querySelector(`#node-${node}`).style.fill = nodeColor;
        changeNode(tempGraph, node, nodeColor);
    
        if(distance > dist[node]){
          continue;
        }
    
        if (document.querySelector(`#edge-${node}${prevNode}`)) {
          document.querySelector(`#edge-${node}${prevNode}`).style.stroke = lineColor;
          changeLink(tempGraph, node, prevNode, lineColor);
        }
        if (document.querySelector(`#edge-${prevNode}${node}`)) {
          document.querySelector(`#edge-${prevNode}${node}`).style.stroke = lineColor;
          changeLink(tempGraph, prevNode, node, lineColor);
        }
    
        for(let i = 0; i < adj[node].length; i++){
          const currNode = adj[node][i].first;
          const currDist = adj[node][i].second;
    
          if(distance+currDist < dist[currNode]){
            dist[currNode] = distance+currDist;
            q.push(new Triplet(distance+currDist, currNode, node));
            parentArray[currNode] = node;
    
            document.querySelector(`#node-${currNode}`).style.fill = queueColor;
            changeNode(tempGraph, currNode, queueColor);
          }
        }
        recordSteps(finalGraph, stepNumber++, tempGraph);
        setOutput(prevState => ({
          ...prevState,
          heading: `Minimum distance between ${startingNode} to every node`,
          table: {
            startingNode: nodesIndexing,
            dist: dist
          }
        }));
    
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    async function shortestPathHelper(parentArray){
      let q = new PriorityQueue();
      let dist = new Array(size).fill(Infinity);
      dist[startingNode] = 0;
      q.push(new Triplet(0, startingNode, -1));
    
      while(!q.isEmpty()){
        const node = q.front().second;
        const distance = q.front().first;
        const prevNode = q.front().third;
        q.pop();
    
        document.querySelector(`#node-${node}`).style.fill = nodeColor;
        changeNode(tempGraph, node, nodeColor);
    
        if(distance > dist[node]){
          continue;
        }
    
        if (document.querySelector(`#edge-${node}${prevNode}`)) {
          document.querySelector(`#edge-${node}${prevNode}`).style.stroke = lineColor;
          changeLink(tempGraph, node, prevNode, lineColor);
        }
        if (document.querySelector(`#edge-${prevNode}${node}`)) {
          document.querySelector(`#edge-${prevNode}${node}`).style.stroke = lineColor;
          changeLink(tempGraph, prevNode, node, lineColor);
        }
    
        for(let i = 0; i < adj[node].length; i++){
          const currNode = adj[node][i].first;
          const currDist = adj[node][i].second;
    
          if(distance+currDist < dist[currNode]){
            dist[currNode] = distance+currDist;
            q.push(new Triplet(distance+currDist, currNode, node));
            parentArray[currNode] = node;
    
            document.querySelector(`#node-${currNode}`).style.fill = queueColor;
            changeNode(tempGraph, currNode, queueColor);
          }
        }
        recordSteps(finalGraph, stepNumber++, tempGraph);
    
        await new Promise(resolve => setTimeout(resolve, speed));
      }

      return dist[destNode];
    }

    if(algoSimulation === 'dfs'){
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
        setSteps(finalGraph);
      }
      //this code is written by THREE
      performDFS(); // Start DFS traversal
    }else if(algoSimulation === 'bfs'){
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
        setSteps(finalGraph);
      }
    
      performBFS(); // Start BFS traversal
    }else if(algoSimulation === 'bipartiteGraph'){
      setOutput(prevState => ({
        ...prevState,
        note: `BFS algorithm is used to detect Bipartite Graph`,
      }));
      let flag = true;
      async function performBipartiteGraph() {
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            const ans = await bipartiteGraphHelper(i);
            if(ans.length === 2){
              setOutput(prevState => ({
                ...prevState,
                heading: 'Nope, not a Bipartite Graph',
                result: `Node ${ans[0]} and Node ${ans[1]} both have same Color`
              }));
              flag = false;
              break;
            }
          }
        }

        if(flag){
          setOutput(prevState => ({
            ...prevState,
            heading: 'Yes, It is a Bipartite Graph',
            reslut: ''
          }));
        }
        
        setDisableFunctions(false);
        setSteps(finalGraph);
      }
      //this code is written by THREE
      performBipartiteGraph();
    }else if(algoSimulation === 'detectCycle'){
      setOutput(prevState => ({
        ...prevState,
        note: `DFS algorithm is used to detect cycle.`,
      }));
      // console.log('Detect Cycle Function');
      async function performDFS() {
        let flag = [false];
        let cycleNodes = {
          nodes: []
        };
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            flag = await detectCycleHelper(i, -1, cycleNodes);
            // If cycle exists in the graph
            if(flag[0]){
              setOutput(prevState => ({
                ...prevState,
                heading: 'Cycle Detected'
              }));
              
              let firstNode = cycleNodes.nodes[0], secondNode, outputString = `${cycleNodes.nodes[cycleNodes.nodes.length-1]} `;
              for(let j = 1; j < cycleNodes.nodes.length; j++){
                outputString += `${cycleNodes.nodes[cycleNodes.nodes.length-j-1]} `;
                secondNode = cycleNodes.nodes[j];
                if (document.querySelector(`#edge-${firstNode}${secondNode}`)) {
                  document.querySelector(`#edge-${firstNode}${secondNode}`).style.stroke = 'red';
                  changeLink(tempGraph, firstNode, secondNode, 'red');
                }
                if (document.querySelector(`#edge-${secondNode}${firstNode}`)) {
                  document.querySelector(`#edge-${secondNode}${firstNode}`).style.stroke = 'red';
                  changeLink(tempGraph, secondNode, firstNode, 'red');
                }
                firstNode = secondNode;
              }
              firstNode = cycleNodes.nodes[0];
              secondNode = cycleNodes.nodes[cycleNodes.nodes.length-1];
              if (document.querySelector(`#edge-${firstNode}${secondNode}`)) {
                document.querySelector(`#edge-${firstNode}${secondNode}`).style.stroke = 'red';
                changeLink(tempGraph, firstNode, secondNode, 'red');
              }
              if (document.querySelector(`#edge-${secondNode}${firstNode}`)) {
                document.querySelector(`#edge-${secondNode}${firstNode}`).style.stroke = 'red';
                changeLink(tempGraph, secondNode, firstNode, 'red');
              }
              recordSteps(finalGraph, stepNumber++, tempGraph);
              setOutput(prevState => ({
                ...prevState,
                result: outputString
              }));
              
              break;
            }
          }
        }
        if(!flag[0]){
          setOutput(prevState => ({
            ...prevState,
            heading: 'No Cycle exists in the given Graph.'
          }));
          // console.log('No Cycle Exist');
        }
        setDisableFunctions(false);
        setSteps(finalGraph);
        console.log(finalGraph);
      }
      //this code is written by THREE
      performDFS();
    }else if(algoSimulation === 'dijkstraAlgo'){
      setOutput(prevState => ({
        ...prevState,
        note: `Priority Queue is used in this Algorithm`,
      }));

      async function performDijkstraAlgro() {
        await dijktraHelper();
        setDisableFunctions(false);
        setSteps(finalGraph);
      }

      performDijkstraAlgro();
    }else if(algoSimulation === 'shortestPath'){
      setOutput(prevState => ({
        ...prevState,
        note: `Dijkstra's Algorithm is used to find Shortest Path`,
      }));

      async function performShortestPath(){
        let parentArray = new Array(size);
        for(let i = 0; i < size; i++){
          parentArray[i] = i;
        }
        let dist = await shortestPathHelper(parentArray);
        if(dist === Infinity){
          setOutput(prevState => ({
            ...prevState,
            heading: `No path between ${startingNode} to ${destNode}.`
          }));
        }else{
          let idx = destNode;
          let s = '';
          let path = [];
          while(parentArray[idx] != idx){
            if (document.querySelector(`#edge-${idx}${parentArray[idx]}`)) {
              document.querySelector(`#edge-${idx}${parentArray[idx]}`).style.stroke = 'blue';
              changeLink(tempGraph, idx, parentArray[idx], 'blue');
            }
            if (document.querySelector(`#edge-${parentArray[idx]}${idx}`)) {
              document.querySelector(`#edge-${parentArray[idx]}${idx}`).style.stroke = 'blue';
              changeLink(tempGraph, parentArray[idx], idx, 'blue');
            }
            document.querySelector(`#node-${idx}`).style.fill = 'blue';
            changeNode(tempGraph, idx, 'blue');
            path.push(idx);
            idx = parentArray[idx];
          }

          document.querySelector(`#node-${idx}`).style.fill = 'blue';
          changeNode(tempGraph, idx, 'blue');
          path.push(idx);
          recordSteps(finalGraph, stepNumber++, tempGraph);

          for(let i = 0; i < path.length/2; i++){
            let temp = path[i];
            path[i] = path[path.length-1-i];
            path[path.length-1-i] = temp;
          }
          for(let i = 0; i < path.length; i++){
            s += path[i];

            if(i != path.length-1){
              s += ' -> ';
            }
          }

          setOutput(prevState => ({
            ...prevState,
            heading: `Shortest Path`,
            result: `Path Length: ${dist} units
            
            Path: ${s}`
          }));
        }
        setDisableFunctions(false);
        setSteps(finalGraph);
      }

      if(startingNode == destNode){
        setOutput(prevState => ({
          ...prevState,
          heading: `Shortest Path`,
          result: `Path Length: ${0} units
          
          Path: ${startingNode}`
        }));

        document.querySelector(`#node-${startingNode}`).style.fill = 'blue';
        changeNode(tempGraph, startingNode, 'blue');
        recordSteps(finalGraph, stepNumber++, tempGraph);

        setDisableFunctions(false);
        setSteps(finalGraph);
      }else{
        performShortestPath();
      }
    }
  }else if(graphType === 'directedWeightedGraph'){
    // Making Adjecency List
    for(let i = 0; i < data.links.length; i++){
      const sourceId = parseInt(data.links[i].source.id);
      const targetId = parseInt(data.links[i].target.id);
      const weight = parseInt(data.links[i].weight);
      adj[sourceId].push(new Pair(targetId, weight));
    }
    // setDisableFunctions(false);

    async function dfsHelper(node, prev, DFSOrder){
      if(vis[node] === true){
        return;
      }

      if(prev !== -1){
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      vis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.querySelector(`#edge-${node}${prev}`)) {
        document.querySelector(`#edge-${node}${prev}`).style.stroke = lineColor;
        changeLink(tempGraph, node, prev, lineColor);
      }
      if (document.getElementById(`arrow-${prev}${node}`)){
        document.getElementById(`arrow-${prev}${node}`).style.fill = 'white';
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);
      recordSteps(finalGraph, stepNumber++, tempGraph);
      DFSOrder.order += `${node} `;
      setOutput(prevState => ({
        ...prevState,
        result: DFSOrder.order
      }));

      for(let i = 0; i < adj[node].length; i++){
        await dfsHelper(adj[node][i].first, node, DFSOrder);
      }
    }

    async function bfsHelper(node) {
      let BFSOrder = '';
      const q = new Queue();
      q.enqueue(new Pair(node, -1));
      vis[node] = true;

      while (!q.isEmpty()) {
        const frontNode = q.front().first;
        
        if (document.querySelector(`#edge-${q.front().second}${frontNode}`)) {
          document.querySelector(`#edge-${q.front().second}${frontNode}`).style.stroke = lineColor;
          changeLink(tempGraph, q.front().second, frontNode, lineColor);
        }
        if (document.querySelector(`#edge-${frontNode}${q.front().second}`)) {
          document.querySelector(`#edge-${frontNode}${q.front().second}`).style.stroke = lineColor;
          changeLink(tempGraph, frontNode, q.front().second, lineColor);
        }
        if (document.getElementById(`arrow-${q.front().second}${frontNode}`)){
          document.getElementById(`arrow-${q.front().second}${frontNode}`).style.fill = 'white';
        }
        document.querySelector(`#node-${frontNode}`).style.fill = nodeColor;
        changeNode(tempGraph, frontNode, nodeColor);
        tempGraph.nodes = tempGraph.nodes.map((node) => {
          if(node.id == frontNode){
            node = {
              ...node,
              color: nodeColor
            }
          }

          return node;
        })
        recordSteps(finalGraph, stepNumber++, tempGraph);
        BFSOrder += `${frontNode} `;
        setOutput(prevState => ({
          ...prevState,
          result: BFSOrder
        }));
  
        for (let i = 0; i < adj[frontNode].length; i++) {
          if (vis[adj[frontNode][i].first] === false) {
            q.enqueue(new Pair(adj[frontNode][i].first, frontNode));
            vis[adj[frontNode][i].first] = true; 
          }
        }
  
        q.dequeue();
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    async function detectCycleHelper(node, prev, cycleNodes, anotherVis){
      if(anotherVis[node] === true){
        // console.log('Cycle Exist');
        await new Promise(resolve => setTimeout(resolve, speed));
        cycleNodes.nodes.push(node);
        return [true, node, false];
      }
      if(vis[node] === true){
        return [false];
      }

      await new Promise(resolve => setTimeout(resolve, speed));
      vis[node] = true;
      anotherVis[node] = true;
      if (document.querySelector(`#edge-${prev}${node}`)) {
        document.querySelector(`#edge-${prev}${node}`).style.stroke = lineColor;
        changeLink(tempGraph, prev, node, lineColor);
      }
      if (document.getElementById(`arrow-${prev}${node}`)){
        document.getElementById(`arrow-${prev}${node}`).style.fill = 'white';
      }
      document.querySelector(`#node-${node}`).style.fill = nodeColor;
      changeNode(tempGraph, node, nodeColor);

      changeNode(tempGraph, node, nodeColor);
      recordSteps(finalGraph, stepNumber++, tempGraph);

      for(let i = 0; i < adj[node].length; i++){
        //If the current node is th prev node
        // if(prev === adj[node][i]){
        //   continue;
        // }

        const tempVar = await detectCycleHelper(adj[node][i].first, node, cycleNodes, anotherVis);
        //If cycle doesn't exist we continue with the algo
        if(!tempVar[0]){
          continue;
        }
        
        //If we have reaced to that node, at which we came to know that there exists a cycle in the graph
        if(node == tempVar[1]){
          cycleNodes.nodes.push(node);
          tempVar[2] = true;
        }

        //This condition keeps on adding the nodes in the string till we find out that we have reached to the node, at which we came to know that there exists a cycle in the graph, So that we can show which nodes make the cycle in the graph in order.
        if(!tempVar[2]){
          cycleNodes.nodes.push(node);
        }

        return [true, tempVar[1], tempVar[2]];
      }
      anotherVis[node] = false;

      return [false];
    }

    async function dijktraHelper(){
      let q = new PriorityQueue();
      let dist = new Array(size).fill(Infinity);
      dist[startingNode] = 0;
      q.push(new Triplet(0, startingNode, -1));
    
      let parentArray = new Array(size);
      for(let i = 0; i < size; i++){
        parentArray[i] = i;
      }
    
      setOutput(prevState => ({
        ...prevState,
        heading: `Minimum distance between ${startingNode} to every node`,
        table: {
          startingNode: nodesIndexing,
          dist: dist
        }
      }));
    
      while(!q.isEmpty()){
        const node = q.front().second;
        const distance = q.front().first;
        const prevNode = q.front().third;
        q.pop();
    
        document.querySelector(`#node-${node}`).style.fill = nodeColor;
        changeNode(tempGraph, node, nodeColor);
    
        if(distance > dist[node]){
          continue;
        }
    
        if (document.querySelector(`#edge-${prevNode}${node}`)) {
          document.querySelector(`#edge-${prevNode}${node}`).style.stroke = lineColor;
          changeLink(tempGraph, prevNode, node, lineColor);
        }
        if (document.getElementById(`arrow-${prevNode}${node}`)){
          document.getElementById(`arrow-${prevNode}${node}`).style.fill = 'white';
        }
    
        for(let i = 0; i < adj[node].length; i++){
          const currNode = adj[node][i].first;
          const currDist = adj[node][i].second;
    
          if(distance+currDist < dist[currNode]){
            dist[currNode] = distance+currDist;
            q.push(new Triplet(distance+currDist, currNode, node));
            parentArray[currNode] = node;
    
            document.querySelector(`#node-${currNode}`).style.fill = queueColor;
            changeNode(tempGraph, currNode, queueColor);
          }
        }
        recordSteps(finalGraph, stepNumber++, tempGraph);
        setOutput(prevState => ({
          ...prevState,
          heading: `Minimum distance between ${startingNode} to every node`,
          table: {
            startingNode: nodesIndexing,
            dist: dist
          }
        }));
    
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    async function shortestPathHelper(parentArray){
      let q = new PriorityQueue();
      let dist = new Array(size).fill(Infinity);
      dist[startingNode] = 0;
      q.push(new Triplet(0, startingNode, -1));
    
      while(!q.isEmpty()){
        const node = q.front().second;
        const distance = q.front().first;
        const prevNode = q.front().third;
        q.pop();
    
        document.querySelector(`#node-${node}`).style.fill = nodeColor;
        changeNode(tempGraph, node, nodeColor);
    
        if(distance > dist[node]){
          continue;
        }
    
        if (document.querySelector(`#edge-${prevNode}${node}`)) {
          document.querySelector(`#edge-${prevNode}${node}`).style.stroke = lineColor;
          changeLink(tempGraph, prevNode, node, lineColor);
        }
        if (document.getElementById(`arrow-${prevNode}${node}`)){
          document.getElementById(`arrow-${prevNode}${node}`).style.fill = 'white';
        }
    
        for(let i = 0; i < adj[node].length; i++){
          const currNode = adj[node][i].first;
          const currDist = adj[node][i].second;
    
          if(distance+currDist < dist[currNode]){
            dist[currNode] = distance+currDist;
            q.push(new Triplet(distance+currDist, currNode, node));
            parentArray[currNode] = node;
    
            document.querySelector(`#node-${currNode}`).style.fill = queueColor;
            changeNode(tempGraph, currNode, queueColor);
          }
        }
        recordSteps(finalGraph, stepNumber++, tempGraph);
    
        await new Promise(resolve => setTimeout(resolve, speed));
      }

      return dist[destNode];
    }

    if(algoSimulation === 'dfs'){
      setOutput(prevState => ({
        ...prevState,
        heading: 'One of the DFS Order:'
      }));
      async function performDFS() {
        let DFSOrder = {
          order: ''
        };
        await dfsHelper(startingNode, -1, DFSOrder);
        setDisableFunctions(false);
        setSteps(finalGraph);
      }

      performDFS(); // Start DFS traversal
    }else if(algoSimulation === 'bfs'){
      setOutput(prevState => ({
        ...prevState,
        heading: 'One of the BFS Order:'
      }));
      async function performBFS() {
        await bfsHelper(startingNode);

        setDisableFunctions(false);
        setSteps(finalGraph);
      }
    
      performBFS(); // Start BFS traversal
    }else if(algoSimulation === 'detectCycle'){
      // console.log('Detect Cycle Function');
      setOutput(prevState => ({
        ...prevState,
        note: `DFS algorithm is used to detect cycle.`,
      }));
      async function performDFS() {
        let flag = [false];
        let cycleNodes = {
          nodes: []
        };
        let anotherVis = Array.from({ length: size }).fill(false);
        for (let i = nodesIndexing; i < size; i++) {
          if (vis[i] === false) {
            flag = await detectCycleHelper(i, -1, cycleNodes, anotherVis);

            //If cycle detected
            if(flag[0]){
              setOutput(prevState => ({
                ...prevState,
                heading: 'Cycle Detected'
              }));
              
              let firstNode = cycleNodes.nodes[0], secondNode, outputString = `${cycleNodes.nodes[cycleNodes.nodes.length-1]} `;
              for(let j = 1; j < cycleNodes.nodes.length; j++){
                if(j < cycleNodes.nodes.length-1){
                  outputString += `${cycleNodes.nodes[cycleNodes.nodes.length-j-1]} `;
                }
                
                secondNode = cycleNodes.nodes[j];
                document.querySelector(`#edge-${secondNode}${firstNode}`).style.stroke = 'red';
                changeLink(tempGraph, secondNode, firstNode, 'red');
                document.getElementById(`arrow-${secondNode}${firstNode}`).style.fill = 'red';
                firstNode = secondNode;
              }
              
              recordSteps(finalGraph, stepNumber++, tempGraph);
              setOutput(prevState => ({
                ...prevState,
                result: outputString
              }));
              
              break;
            }
          }
        }
        if(!flag[0]){
          setOutput(prevState => ({
            ...prevState,
            heading: 'No Cycle exists in the given Graph'
          }));
          // console.log('No Cycle Exist');
        }
        setDisableFunctions(false);
        setSteps(finalGraph);
        // console.log(finalGraph);
      }
      performDFS();
    }else if(algoSimulation === 'dijkstraAlgo'){
      setOutput(prevState => ({
        ...prevState,
        note: `Priority Queue is used in this Algorithm`,
      }));

      async function performDijkstraAlgro() {
        await dijktraHelper();

        setDisableFunctions(false);
        setSteps(finalGraph);
      }

      performDijkstraAlgro();
    }else if(algoSimulation === 'shortestPath'){
      setOutput(prevState => ({
        ...prevState,
        note: `Dijkstra's Algorithm is used to find Shortest Path`,
      }));

      async function performShortestPath(){
        let parentArray = new Array(size);
        for(let i = 0; i < size; i++){
          parentArray[i] = i;
        }
        let dist = await shortestPathHelper(parentArray);
        if(dist === Infinity){
          setOutput(prevState => ({
            ...prevState,
            heading: `No path between ${startingNode} to ${destNode}.`
          }));
        }else{

          let idx = destNode;
          let s = '';
          let path = [];
          while(parentArray[idx] != idx){
            if (document.querySelector(`#edge-${parentArray[idx]}${idx}`)) {
              document.querySelector(`#edge-${parentArray[idx]}${idx}`).style.stroke = 'blue';
              changeLink(tempGraph, parentArray[idx], idx, 'blue');
            }
            if (document.getElementById(`arrow-${parentArray[idx]}${idx}`)){
              document.getElementById(`arrow-${parentArray[idx]}${idx}`).style.fill = 'blue';
            }
            document.querySelector(`#node-${idx}`).style.fill = 'blue';
            changeNode(tempGraph, idx, 'blue');
            path.push(idx);
            idx = parentArray[idx];
          }

          document.querySelector(`#node-${idx}`).style.fill = 'blue';
          changeNode(tempGraph, idx, 'blue');
          path.push(idx);
          recordSteps(finalGraph, stepNumber++, tempGraph);

          for(let i = 0; i < path.length/2; i++){
            let temp = path[i];
            path[i] = path[path.length-1-i];
            path[path.length-1-i] = temp;
          }
          for(let i = 0; i < path.length; i++){
            s += path[i];

            if(i !== path.length-1){
              s += ' -> ';
            }
          }

          setOutput(prevState => ({
            ...prevState,
            heading: `Shortest Path`,
            result: `Path Length: ${dist} units
            
            Path: ${s}`
          }));
        }
        setDisableFunctions(false);
        setSteps(finalGraph);
      }

      if(startingNode === destNode){
        setOutput(prevState => ({
          ...prevState,
          heading: `Shortest Path`,
          result: `Path Length: ${0} units
          
          Path: ${startingNode}`
        }));

        document.querySelector(`#node-${startingNode}`).style.fill = 'blue';
        changeNode(tempGraph, startingNode, 'blue');
        recordSteps(finalGraph, stepNumber++, tempGraph);

        setDisableFunctions(false);
        setSteps(finalGraph);
      }else{
        performShortestPath();
      }
    }
  }
}
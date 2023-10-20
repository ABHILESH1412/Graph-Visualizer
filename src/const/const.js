
export const uanddg = {
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
}

export const uanddwg = {
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
      target: 2,
      weight: 1
    },
    {
      source: 3,
      target: 5,
      weight: 1
    },
    {
      source: 4,
      target: 2,
      weight: 1
    },
    {
      source: 5,
      target: 1,
      weight: 1
    },
    {
      source: 3,
      target: 1,
      weight: 1
    },
  ]
}

export const graphValueInput = {
  uanddg: `Total Nodes, Total Edges
links:
Source Node - Target Node
----------------
Example: 
7 5
1 2
3 5
4 2
5 1
3 1`,
  uanddwg: `Total Nodes, Total Edges, Weights
links:
Source Node - Target Node
----------------
Example: 
7 5 1
1 2 1
3 5 1
4 2 1
5 1 1
3 1 1`
}
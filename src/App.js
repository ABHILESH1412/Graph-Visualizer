import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';


import './App.css';

function App() {
  const svgRef = useRef();
  const graph = {
    nodes: [
      {
        id: 0
      },
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      },
      {
        id: 4
      },
      {
        id: 5
      },
      {
        id: 6
      },
    ],
    links: [
      {
        source: 0,
        target: 1
      },
      {
        source: 2,
        target: 4
      },
      {
        source: 3,
        target: 1
      },
      {
        source: 4,
        target: 0
      },
      {
        source: 2,
        target: 0
      },
    ]
  }

  const first = async () => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    let cvs = d3.select(svgRef.current).style('background', '#D3D3D3');

    let simulation = d3
      .forceSimulation(graph.nodes)
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(graph.links).distance(100))
      .force("collide", d3.forceCollide(30))
      .on('tick', ticked);

    const dragstarted = (event, d) => {
      simulation.alphaTarget(0.3).restart();
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event, d) => {
      simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    let drag = d3
      .drag()
      .on('start', (event, d) => dragstarted(event, d))
      .on('drag', (event, d) => dragged(event, d))
      .on('end', (event, d) => dragended(event, d));

    let links = cvs
      .append('g')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', 10)
      .attr('stroke', 'orange');

    let nodes = cvs
      .append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', '25')
      .attr('fill', 'red');

    nodes.call(drag);

    let texts = cvs.append('g')
      .selectAll('text')
      .data(graph.nodes)
      .enter()
      .append('text')
      .text(d => d.id)
      .attr('font-size', 24)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', 10)
      .attr('cursor', 'default');
    
      texts.call(drag);

    function ticked() {
      texts.attr('x', d => d.x);
      texts.attr('y', d => d.y);
      nodes
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        })

      links
        .attr('x1', (d) => {
          return d.source.x;
        })
        .attr('y1', (d) => {
          return d.source.y;
        })
        .attr('x2', (d) => {
          return d.target.x;
        })
        .attr('y2', (d) => {
          return d.target.y;
        })
    }

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4]) // Define the zoom range
      .on('zoom', (event) => {
        nodes.attr('transform', event.transform);
        links.attr('transform', event.transform);
        texts.attr('transform', event.transform);
      });

    cvs.call(zoom);
  }


  useEffect(() => {
    first();
  }, []);

  return (
    <div className="App">
      <svg ref={svgRef} className='svgRef'></svg>
    </div>
  );
}

export default App;

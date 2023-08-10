import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import './Graph.css';

export default function Graph(props) {
  // const graph = props.graph;
  const svgRef = useRef();
  const nodeColor = 'red';
  const nodeRadius = 25;
  const edgeColor = 'orange';
  const edgeWidth = 10;
  const edgeDistance = 100;
  const canvasColor = '#D3D3D3';
  const forceStrength = -50;
  const collideForce = nodeRadius+5;
  const fontSize = 24;

  //Function which will draw the graph on the SVG Canvas
  const draw = async () => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    let cvs = d3.select(svgRef.current).style('background', canvasColor);

    let simulation = d3
      .forceSimulation(props.graph.nodes)
      .force('charge', d3.forceManyBody().strength(forceStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(props.graph.links).distance(edgeDistance))
      .force("collide", d3.forceCollide(collideForce))
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

    //Edges of the Graph
    let links = cvs
      .append('g')
      .selectAll('line')
      .data(props.graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', edgeWidth)
      .attr('stroke', edgeColor);

    //Nodes of the Graph
    let nodes = cvs
      .append('g')
      .selectAll('circle')
      .data(props.graph.nodes)
      .enter()
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', nodeColor);

    nodes.call(drag);

    //Numbering on the Nodes
    let texts = cvs.append('g')
      .selectAll('text')
      .data(props.graph.nodes)
      .enter()
      .append('text')
      .text(d => d.id)
      .attr('font-size', fontSize)
      .style('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', 10)
      .attr('cursor', 'default');
    
    texts.call(drag);

    //A force-directed layout aims to position nodes (or vertices) and edges (or links) in a way that minimizes overlapping and optimizes the overall layout based on various forces applied to the nodes and edges.
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

    //Zoom in and Zoom out functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4]) // Define the zoom range
      .on('zoom', (event) => {
        nodes.attr('transform', event.transform);
        links.attr('transform', event.transform);
        texts.attr('transform', event.transform);
      });

    cvs.call(zoom);

    cvs.exit().remove();
  }

  useEffect(() => {
    draw();
  }, [props.graph]);

  return (
    <div>
      <svg ref={svgRef} className='svgRef'></svg>
    </div>
  )
}
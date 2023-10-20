import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import './Graph.css';

export default function Graph(props) {
  const svgRef = useRef();
  const nodeColor = 'red';
  const nodeRadius = 25;
  const edgeColor = 'orange';
  const edgeWidth = 6;
  const edgeDistance = 250;
  const forceStrength = -30;
  const collideForce = nodeRadius+5;

  //Function which will draw the graph on the SVG Canvas
  const draw = async () => {
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    let cvs = d3.select(svgRef.current);
    d3.select(svgRef.current).selectAll('*').remove();

    let simulation = d3
      .forceSimulation(props.graph.nodes)
      .force('charge', d3.forceManyBody().strength(forceStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(props.graph.links).id(d => d.id).distance(edgeDistance))
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

    // Edges of the Graph
    let links = cvs
      .append('g')
      .selectAll('.link')
      .data(props.graph.links)
      .enter()
      .append('line')
      .attr('class', 'link') 
      .attr('stroke-width', edgeWidth)
      .attr('stroke', edgeColor)
      .attr('id', (d) => {
        return 'edge-' + d.source.id + d.target.id;
      })

    let weights;

    // for curved edges
    // const links = cvs
    //   .append('g')
    //   .selectAll('.link')
    //   .data(props.graph.links)
    //   .enter()
    //   .append('path') // Use path instead of line
    //   .attr('class', 'link')
    //   .attr('stroke-width', edgeWidth)
    //   .attr('stroke', edgeColor)
    //   .attr('fill', 'none')
    //   .attr('id', (d) => 'edge-' + d.source.id + '-' + d.target.id)
    //   .attr('d', (d) => {
    //     // Calculate the control points for a curved link
    //     const sourceX = d.source.x;
    //     const sourceY = d.source.y;
    //     const targetX = d.target.x;
    //     const targetY = d.target.y;

    //     return `M${sourceX},${sourceY} C${sourceX},${(sourceY + targetY) / 2} ${targetX},${(sourceY + targetY) / 2} ${targetX},${targetY}`;
      // });
  

    if(props.graphType === 'directedGraph' || props.graphType === 'directedWeightedGraph'){
      // // Pointing Arrows
      // cvs.append('defs')
      //   .append('marker')
        // .attr('id', 'arrow-marker')
        // .attr('viewBox', '0 -5 10 10')
        // .attr('refX', 18.5) // Shift arrowhead along the line
        // .attr('markerWidth', 4)
        // .attr('markerHeight', 6)
        // .attr('orient', 'auto')
      //   .append('path')
      //   .attr('d', 'M0,-5L10,0L0,5') // Arrowhead path
      //   .attr('fill', edgeColor); // Use the edge color

      // //adding pointing arrows to the edges
      // links.attr('marker-end', 'url(#arrow-marker)');

      links
        .attr('marker-end', (d, i) => {
          const arrowId = 'arrow-' + d.source.id + '-' + d.target.id; // Unique arrow ID
          // Define the arrow marker for each edge
          cvs.append('defs').append('marker')
            .attr('id', arrowId)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 18.5) // Shift arrowhead along the line
            .attr('markerWidth', 4)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('id', () => {
              return `arrow-${d.source.id}${d.target.id}`;
            })
            .attr('fill', 'orange')
            .attr('d', 'M0,-5L10,0L0,5'); // Path of the arrowhead shape
          return 'url(#' + arrowId + ')';
        });
    }

    if(props.graphType === 'undirectedWeightedGraph' || props.graphType === 'directedWeightedGraph'){
      weights = cvs.append('g')
        .selectAll('text')
        .data(props.graph.links)
        .enter()
        .append('text')
        .text(d => d.weight)
        .style('font-weight', 'bold')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('text-anchor', 'middle')
        .attr('dy', 10)
        .attr('cursor', 'default')
        .attr('class', 'ft-sz-4')
        .attr('id', (d) => {
          return 'edge-weight-' + d.id;
        })
    }

      //Nodes of the Graph
    let nodes = cvs
      .append('g')
      .selectAll('circle')
      .data(props.graph.nodes)
      .enter()
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', nodeColor)
      .attr('id', (d) => {
        return 'node-' + d.id;
      });
  
      nodes.call(drag);
      
    //this code is written by THREE
    //Numbering on the Nodes
    let texts = cvs.append('g')
      .selectAll('text')
      .data(props.graph.nodes)
      .enter()
      .append('text')
      .text(d => d.id)
      .style('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', 10)
      .attr('cursor', 'default')
      .attr('class', 'ft-sz-3')
      .attr('id', (d) => {
        return 'node-text-' + d.id;
      })
    
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

      if(props.graphType === 'undirectedWeightedGraph' || props.graphType === 'directedWeightedGraph'){
        weights
          .attr('x', d => (d.source.x + d.target.x) / 2)
          .attr('y', d => (d.source.y + d.target.y) / 2);
      }

      //for curved path
      // links.attr('d', (d) => {
      //   const sourceX = d.source.x;
      //   const sourceY = d.source.y;
      //   const targetX = d.target.x;
      //   const targetY = d.target.y;

      //   const dx = targetX - sourceX;
      //   const dy = targetY - sourceY;
      //   const dr = Math.sqrt(dx * dx + dy * dy);
      //   const xOffset = sourceX + (dx / dr) * nodeRadius;
      //   const yOffset = sourceY + (dy / dr) * nodeRadius;

      //   return `M${sourceX},${sourceY} C${sourceX},${(sourceY + targetY) / 2} ${targetX},${(sourceY + targetY) / 2} ${targetX},${targetY}`;
      // });
    }

    //Zoom in and Zoom out functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4]) // Define the zoom range
      .on('zoom', (event) => {
        nodes.attr('transform', event.transform);
        links.attr('transform', event.transform);
        texts.attr('transform', event.transform);
        if(props.graphType === 'undirectedWeightedGraph' || props.graphType === 'directedWeightedGraph'){
          weights.attr('transform', event.transform);
        }
      });

    cvs.call(zoom);
  }

  useEffect(() => {
    draw();
  }, [props.graph, props.graphType]);

  return (
    <div className='graphContainer'>
      <svg ref={svgRef} className='svgRef'></svg>
    </div>
  )
}
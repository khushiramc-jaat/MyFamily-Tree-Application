import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParentNode = () => {
    const navigate=useNavigate();
  const [nodes, setNodes] = useState([
    { id: 1, x: 300, y: 200 },
  ]);

  const handleNodeClick = (index) => {
    setNodes((prevNodes) => {
      const right = {
        id: prevNodes.length + 1,
        x: prevNodes[index].x + 50,
        y: prevNodes[index].y - 50
      };

      const left = {
        id: prevNodes.length + 2,
        x: prevNodes[index].x - 50,
        y: prevNodes[index].y - 50
      };

      const newNode = [right, left];

      // Connect the new nodes to the clicked node
      

      return [...prevNodes, ...newNode];
    });
  };

  const renderNodes = () =>
    nodes.map((node) => (
      <React.Fragment key={node.id}>
        <circle
          cx={node.x}
          cy={node.y}
          r={25}
          fill="blue"
          stroke="black"
          strokeWidth="2"
          onClick={() => handleNodeClick(node.id - 1)}
          style={{ cursor: 'pointer' }}
        />
      </React.Fragment>
    ));

    const renderLines = () => {
        const lines = [];
      
        for (let i = 1; i < nodes.length; i++) {
          const center = {
            x: (nodes[1].x + nodes[2].x) / 2,
            y: (nodes[1].y + nodes[2].y) / 2
          };
      
          lines.push(
            <React.Fragment>
              <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[2].x} y2={nodes[2].y} stroke="black" />
              <line x1={center.x} y1={center.y} x2={nodes[0].x} y2={nodes[0].y} stroke="black" />
            </React.Fragment>
          );
        }
      
        return lines;
      };

  return (
    <svg width="400" height="400">
      {renderLines()}
      {renderNodes()}
    </svg>
  );
};

export default ParentNode;

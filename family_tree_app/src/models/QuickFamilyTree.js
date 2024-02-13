import React, { useState } from 'react';

const TreeNode = ({ x, y, onClick }) => (
  <g transform={`translate(${x},${y})`} className="tree-node" onClick={onClick}>
    <circle cx="0" cy="0" r="20" fill="blue" />
  </g>
);

const TreeLine = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
);

const FamilyTree = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 300, y: 250, left: null, right: null, parents: [] }
  ]);
  const [addParentsMode, setAddParentsMode] = useState(false);
  const [addChildMode, setAddChildMode] = useState(false);

  const handleNodeClick = (clickedNode) => {
    console.log(`Clicked Node Coordinates: (${clickedNode.x}, ${clickedNode.y})`);
    console.log(`Clicked Node Index: ${clickedNode.id}`);

    // Continue with your logic...

    // Toggle between adding left and right child nodes
    if (addParentsMode) {
        const parents1 = { x: nodes[0].x + 100, y: nodes[0].y - 100, left:null,right:null,parent:[] };
        const parents2 = { x: nodes[0].x - 100, y: nodes[0].y - 100, children: [] };
  
        // Add the new parents to the parents array of the clicked node
        const updatedNodes = [...nodes];
        updatedNodes[0].parents.push(parents1);
        updatedNodes[0].parents.push(parents2);
  
        setNodes(updatedNodes);
      }
      else if(addChildMode){
            const isLeft = clickedNode.left === null;
            const xOffset = isLeft ? -100 : 100;

            const newChild = {
            id: nodes.length + 1,
            x: clickedNode.x + xOffset,
            y: clickedNode.y + 100,
            left: null,
            right: null,
            parents: [clickedNode],
            };

            // Connect the new node to the clicked node
            if (isLeft) {
            clickedNode.left = newChild;
            } else {
            clickedNode.right = newChild;
            }

            setNodes([...nodes, newChild]);
        }
      }

  const renderTree = (currentNode) => {
    if (!currentNode) return null;

    return (
      <React.Fragment key={currentNode.id}>
        {currentNode.left && (
          <React.Fragment>
            <TreeLine x1={currentNode.x} y1={currentNode.y} x2={currentNode.left.x} y2={currentNode.left.y} />
            {renderTree(currentNode.left)}
          </React.Fragment>
        )}
        {currentNode.right && (
          <React.Fragment>
            <TreeLine x1={currentNode.x} y1={currentNode.y} x2={currentNode.right.x} y2={currentNode.right.y} />
            {renderTree(currentNode.right)}
          </React.Fragment>
        )}
        <TreeNode x={currentNode.x} y={currentNode.y} onClick={() => handleNodeClick(currentNode)} />
      </React.Fragment>
    );
  };

  return (
    <>
        <button onClick={() => setAddParentsMode(!addParentsMode)}>
        {addParentsMode ? 'Adding Parents' : 'Add Parents'}
      </button>
      <button onClick={() => setAddChildMode(!addChildMode)}>
        {addChildMode ? 'Adding Child' : 'Add Child'}
      </button>
      <svg width="400" height="200" className="family-tree">
      {renderTree(nodes[0])}
    </svg>
    </>
    
  );
};

export default FamilyTree;
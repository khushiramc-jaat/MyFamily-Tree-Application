import React, { useState } from 'react';

const TreeNode = ({ x, y, onClick, onDelete }) => (
  <g transform={`translate(${x},${y})`} className="tree-node" onClick={onClick}>
    <circle cx="0" cy="0" r="8" fill="blue" />
    <text x="-10" y="20" fontSize="12" fill="red" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
    {onClick && (
        <>
          {Object.entries(onClick).map(([key, value]) => (
            <tspan key={key} x="-10" dy="1.2em">{`${key}: ${value}`}</tspan>
          ))}
        </>
      )}
    </text>
  </g>
);

const TreeLine = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
);

const NodeDetails = ({ details }) => (
  <div style={{ 
    position: 'absolute',
    top: `${details.y + 5}px`,
    left: `${details.x}px`,
    border: '1px solid black',
    padding: '2px',
    marginTop: '5px',
    borderRadius: '5px',
    backgroundColor: 'white',
    zIndex: 1,
    display: 'flex',
   }}>
    <p style={{ margin: '0px 0' }}>Id: {details.id}</p>
    <p style={{ margin: '0px 0' }}>Name: {details.details.name}</p>
    <p style={{ margin: '0px 0' }}>Age: {details.details.age}</p>
    <p style={{ margin: '0px 0' }}>Date of Birth: {details.details.dob}</p>
    <p style={{ margin: '0px 0' }}>Date of Death: {details.details.dod}</p>
  </div>
);

const FamilyTree = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 200, y: 150, left: null, right: null, father:null,mother:null, spouse: null, details: { name: "", age: "", dob: "", dod: "" } }
    // Add more nodes as needed
  ]);
  const [addParentsMode, setAddParentsMode] = useState(false);
  const [addChildMode, setAddChildMode] = useState(false);
  const [addSpouseMode, setSpouseMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedNode, setEditedNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (clickedNode) => {
    console.log(`Clicked Node Coordinates: (${clickedNode.x}, ${clickedNode.y})`);
    console.log(`Clicked Node Index: ${clickedNode.id}`);
    if (clickedNode.spouse) {
      console.log(`Clicked Spouse Node Coordinates: (${clickedNode.spouse.x}, ${clickedNode.spouse.y})`);
      console.log(`Clicked Spouse Node Index: ${clickedNode.spouse.id}`);
    }

    // Set the selected node for displaying details
    setSelectedNode(clickedNode);

    if (editMode) {
      // Open the edit form for the clicked node
      setEditedNode(clickedNode);
    } else {
      // Toggle between adding parents, adding child nodes, and adding spouse
      if (addParentsMode) {
        const isLeft = clickedNode.father === null;
        const xOffset = isLeft ? -20 : 20;

        const newChild = {
          id: nodes.length + 1,
          x: clickedNode.x + xOffset,
          y: clickedNode.y - 20,
          left: null,
          right: null,
          spouse: null,
          father:null,
          mother:null,
          details: { name: "", age: "", dob: "", dod: "" }
        };

        // Connect the new node to the clicked node
        if (isLeft) {
          clickedNode.father = newChild;
        } else {
          clickedNode.mother = newChild;
        }

        setNodes([...nodes, newChild]);

      } else if (addChildMode) {
        const isLeft = clickedNode.left === null;
        const xOffset = isLeft ? -40 : 20;

        const newChild = {
          id: nodes.length + 1,
          x: clickedNode.x + xOffset,
          y: isLeft ? clickedNode.y + 30 :clickedNode.y + 5,
          left: null,
          right: null,
          spouse: null,
          father:null,
          mother:null,
          details: { name: "", age: "", dob: "", dod: "" }
        };

        // Connect the new node to the clicked node
        if (isLeft) {
          clickedNode.left = newChild;
        } else {
          clickedNode.right = newChild;
        }

        setNodes([...nodes, newChild]);
      } else if (addSpouseMode) {
        const newSpouse = {
          id: nodes.length + 1,
          x: clickedNode.x + 20,
          y: clickedNode.y,
          left: null,
          right: null,
          father:null,
          spouse: clickedNode,
          details: { name: "", age: "", dob: "", dod: "" }
        };
        clickedNode.spouse = newSpouse;
        setNodes([...nodes,newSpouse])
      }
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Update the details of the edited node
    const updatedNodes = [...nodes];
    const index = editedNode.id - 1;
    updatedNodes[index].details = { ...editedNode.details }; // Copy the edited details
    setNodes(updatedNodes);
    setEditMode(false);
    setEditedNode(null);
  };

  const handleDelete = (clickedNode) => {
    if (Array.isArray(nodes)) {
        const updatedNodes = deleteSubtree([...nodes], clickedNode);
        setNodes(updatedNodes);
        setSelectedNode(null);
      }
  };

  const deleteSubtree = (nodes, nodeToDelete) => {
    const findAndDelete = (currentNode) => {
      if (!currentNode) return null;
  
      if (currentNode === nodeToDelete || currentNode.spouse === nodeToDelete) {
        return null; // Remove the node
      }
  
      return {
        ...currentNode,
        left: currentNode.left && findAndDelete(currentNode.left),
        right: currentNode.right && findAndDelete(currentNode.right),
        spouse: currentNode.spouse === nodeToDelete ? null : findAndDelete(currentNode.spouse),
      };
    };
  
    const updatedNodes = findAndDelete(nodes[0]);
  
    return updatedNodes ? [updatedNodes] : [];
  };
  
  

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
        <TreeNode
          x={currentNode.x}
          y={currentNode.y}
          onClick={() => handleNodeClick(currentNode)}
          onDelete={() => handleDelete(currentNode)}
        />
        {currentNode.father && (
          <React.Fragment>
            <TreeLine x1={currentNode.x} y1={currentNode.y} x2={currentNode.father.x} y2={currentNode.father.y} />
            {renderTree(currentNode.father)}
          </React.Fragment>
        )}
        {currentNode.mother && (
          <React.Fragment>
            <TreeLine x1={currentNode.x} y1={currentNode.y} x2={currentNode.mother.x} y2={currentNode.mother.y} />
            {renderTree(currentNode.mother)}
          </React.Fragment>
        )}
        {currentNode.spouse && (
          <React.Fragment>
            <TreeLine x1={currentNode.x} y1={currentNode.y} x2={currentNode.spouse.x} y2={currentNode.spouse.y} />
            <TreeNode
              x={currentNode.spouse.x}
              y={currentNode.spouse.y}
              onDelete={() => handleDelete(currentNode.spouse)}
            />
          </React.Fragment>
        )}
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
      <button onClick={() => setSpouseMode(!addSpouseMode)}>
        {addSpouseMode ? 'Adding Spouse' : 'Add Spouse'}
      </button>
      <button onClick={() => { setEditMode(true); setEditedNode(selectedNode); }}>
        Edit
      </button>
      <button onClick={() => handleDelete(selectedNode)}>
        Delete
      </button>
      {selectedNode && <NodeDetails details={selectedNode} />}
      {editMode && (
        <form onSubmit={handleEditSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={editedNode.details.name}
              onChange={(e) => setEditedNode({ ...editedNode, details: { ...editedNode.details, name: e.target.value } })}
            />
          </label>
          <br />
          <label>
            Age:
            <input
              type="text"
              value={editedNode.details.age}
              onChange={(e) => setEditedNode({ ...editedNode, details: { ...editedNode.details, age: e.target.value } })}
            />
          </label>
          <br />
          <label>
            Date of Birth:
            <input
              type="text"
              value={editedNode.details.dob}
              onChange={(e) => setEditedNode({ ...editedNode, details: { ...editedNode.details, dob: e.target.value } })}
            />
          </label>
          <br />
          <label>
            Date of Death:
            <input
              type="text"
              value={editedNode.details.dod}
              onChange={(e) => setEditedNode({ ...editedNode, details: { ...editedNode.details, dod: e.target.value } })}
            />
          </label>
          <br />
          <button type="submit">Save</button>
        </form>
      )}
      <svg width="400" height="600" className="family-tree">
        {renderTree(nodes[0])}
      </svg>
    </>
  );
};

export default FamilyTree;

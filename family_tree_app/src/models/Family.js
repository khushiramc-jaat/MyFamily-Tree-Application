import React, { useState } from 'react';
import './FamilyTree.css';

const Family = () => {
  const [family, setFamily] = useState({
    name: "You",
    children: [
      {
        name: "Child 1",
        children: [
          {
            name: "Grandchild 1",
            children: [],
          },
        ],
      },
      {
        name: "Child 2",
        children: [],
      },
    ],
    spouse: {
      name: "Spouse",
      children: [
        {
          name: "Child 3",
          children: [],
        },
      ],
    },
    parents: [
      {
        name: "Father",
        children: [
          {
            name: "You",
            children: [],
          },
          {
            name: "Sibling",
            children: [],
          },
        ],
      },
      {
        name: "Mother",
        children: [
          {
            name: "You",
            children: [],
          },
          {
            name: "Sibling",
            children: [],
          },
        ],
      },
    ],
  });

  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleAddChild = () => {
    if (selectedNode) {
      const newChild = {
        name: `New Child ${selectedNode.children.length + 1}`,
        children: [],
      };

      setFamily((prevFamily) => addChild(prevFamily, selectedNode, newChild));
    }
  };

  const handleAddParent = () => {
    if (selectedNode) {
      const newParent = {
        name: `New Parent ${selectedNode.parents.length + 1}`,
        children: [selectedNode],
      };

      setFamily((prevFamily) => addParent(prevFamily, selectedNode, newParent));
    }
  };

  const handleAddSpouse = () => {
    if (selectedNode && !selectedNode.spouse) {
      const newSpouse = {
        name: `New Spouse`,
        children: [],
      };

      setFamily((prevFamily) => addSpouse(prevFamily, selectedNode, newSpouse));
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setFamily((prevFamily) => deleteNode(prevFamily, selectedNode));
      setSelectedNode(null);
    }
  };

  const addChild = (currentFamily, targetNode, newChild) => {
    const updatedFamily = { ...currentFamily };
    const traverseAndAddChild = (node) => {
      if (node === targetNode) {
        node.children.push(newChild);
      } else if (node.children) {
        node.children.forEach((child) => traverseAndAddChild(child));
      } else if (node.spouse && node.spouse.children) {
        node.spouse.children.forEach((child) => traverseAndAddChild(child));
      }
    };
    traverseAndAddChild(updatedFamily);
    return updatedFamily;
  };

  const addParent = (currentFamily, targetNode, newParent) => {
    const updatedFamily = { ...currentFamily };
    const traverseAndAddParent = (node) => {
      if (node.children && node.children.includes(targetNode)) {
        node.parents.push(newParent);
      } else if (node.children || (node.spouse && node.spouse.children)) {
        const childrenList = node.children || node.spouse.children;
        childrenList.forEach((child) => traverseAndAddParent(child));
      }
    };
    traverseAndAddParent(updatedFamily);
    return updatedFamily;
  };

  const addSpouse = (currentFamily, targetNode, newSpouse) => {
    const updatedFamily = { ...currentFamily };
    const traverseAndAddSpouse = (node) => {
      if (node.children && node.children.includes(targetNode)) {
        node.spouse = newSpouse;
        newSpouse.spouse = node;
      } else if (node.children || (node.spouse && node.spouse.children)) {
        const childrenList = node.children || node.spouse.children;
        childrenList.forEach((child) => traverseAndAddSpouse(child));
      }
    };
    traverseAndAddSpouse(updatedFamily);
    return updatedFamily;
  };

  const deleteNode = (currentFamily, targetNode) => {
    const updatedFamily = { ...currentFamily };
    const traverseAndDeleteNode = (node) => {
      if (node.children && node.children.includes(targetNode)) {
        node.children = node.children.filter((child) => child !== targetNode);
      } else if (node.spouse && node.spouse.children && node.spouse.children.includes(targetNode)) {
        node.spouse.children = node.spouse.children.filter((child) => child !== targetNode);
      } else if (node.parents) {
        node.parents.forEach((parent) => traverseAndDeleteNode(parent));
      }
    };
    traverseAndDeleteNode(updatedFamily);
    return updatedFamily;
  };

  const renderTree = (node, x, y, level) => {
    const nodes = [
      <g key={node.name} transform={`translate(${x},${y})`} className={`tree-node level-${level}`} onClick={() => handleNodeClick(node)}>
        <circle cx="0" cy="0" r="20" fill="#7FB3D5" />
        <text x="0" y="5" textAnchor="middle" fill="white">{node.name}</text>
      </g>,
    ];

    if (node.children) {
      const childY = y + 100;
      const childX = x - (node.children.length - 1) * 50;

      nodes.push(
        ...node.children.map((child, index) => (
          <React.Fragment key={child.name}>
            <line className="tree-line" x1={x} y1={y + 20} x2={childX + index * 100} y2={childY} />
            {renderTree(child, childX + index * 100, childY + 100, level + 1)}
          </React.Fragment>
        ))
      );
    }

    if (node.spouse) {
      const spouseY = y - 50;
      const spouseX = x - 50;

      nodes.push(
        <React.Fragment key={node.spouse.name}>
          <line className="tree-line" x1={x} y1={y - 20} x2={spouseX} y2={spouseY} />
          {renderTree(node.spouse, spouseX, spouseY, level)}
        </React.Fragment>
      );
    }

    if (node.parents) {
      const parentY = y - 50;
      const parentX = x - (node.parents.length - 1) * 50;

      nodes.push(
        ...node.parents.map((parent, index) => (
          <React.Fragment key={parent.name}>
            <line className="tree-line" x1={x} y1={y - 20} x2={parentX + index * 100} y2={parentY} />
            {renderTree(parent, parentX + index * 100, parentY - 100, level)}
          </React.Fragment>
        ))
      );
    }

    return nodes;
  };

  return (
    <div>
      <div>
        <button onClick={handleAddChild} disabled={!selectedNode}>
          Add Child to {selectedNode ? selectedNode.name : ''}
        </button>
        <button onClick={handleAddParent} disabled={!selectedNode}>
          Add Parent to {selectedNode ? selectedNode.name : ''}
        </button>
        <button onClick={handleAddSpouse} disabled={!selectedNode || selectedNode.spouse}>
          Add Spouse to {selectedNode ? selectedNode.name : ''}
        </button>
        <button onClick={handleDeleteNode} disabled={!selectedNode}>
          Delete {selectedNode ? selectedNode.name : ''}
        </button>
      </div>
      <svg width="800" height="600" className="family-tree">
        {renderTree(family, 400, 50, 1)}
      </svg>
    </div>
  );
};

export default Family;

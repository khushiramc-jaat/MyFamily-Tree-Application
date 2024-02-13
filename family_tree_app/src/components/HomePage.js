import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faContactCard, faUsersViewfinder, faPlus, faMinus, faLocation } from '@fortawesome/free-solid-svg-icons';
import "./homepage.css";

const TreeNode = ({ x, y, onClick ,onDelete}) => (
  <g transform={`translate(${x},${y})`} className="tree-node" onClick={onClick}>
    <circle cx="0" cy="0" r="8" fill="blue" />
  </g>
);

const TreeLine = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
);

// const NodeDetails = ({ details ,position }) => (
    
//     <div style={{ 
//       position: 'absolute',
//       top: `${position.y+100}px`, // Adjust the value based on your layout
//       left: `${position.x+100}px`,
//       border: '1px solid black',
//       padding: '2px',
//       marginTop: '5px',
//       borderRadius: '5px',
//       backgroundColor: 'white',
//       zIndex: 1, // Ensure it appears above the SVG
//       display: 'flex', // Use flex container
//      // Arrange children in a column
//      }}>
//       {/* <h3 style={{ fontSize: '16px', margin: '5px 0' }}>Node Details:</h3> */}
//       <p style={{ margin: '0px 0' }}></p>
//       <p style={{ margin: '-2px 0',  fontSize:"7px"}}>Name: {details.details.name}</p>
//       <p style={{ margin: '-2px 0',fontSize:"7px" }}>Age: {details.details.age}</p>
//       {/* <p style={{ margin: '0px 0' }}>Date of Birth: {details.details.dob}</p>
//       <p style={{ margin: '0px 0' }}>Date of Death: {details.details.dod}</p> */}
//     </div>
//   );

function HomePage() {
    
  const [nodes, setNodes] = useState([]);
  const [addParentsMode, setAddParentsMode] = useState(false);
  const [addChildMode, setAddChildMode] = useState(false);
  const [addSpouseMode, setSpouseMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedNode, setEditedNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [svgTranslate, setSvgTranslate] = useState({ x: 0, y: 0 });
  const [formVisible, setFormVisible] = useState(true);
  const [detailsPosition, setDetailsPosition] = useState({ x: 0, y: 0 });
  const [selectedNodeDetails, setSelectedNodeDetails] = useState(null);
  const [nodesLoaded, setNodesLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch nodes from the backend when the component mounts
        const response = await axios.get('http://localhost:5000/get/api/nodes');
        setNodes(response.data);
        setNodesLoaded(true);

        // Check if nodes are empty and add the first node if needed
        if (nodes.length === 0) {
          const firstNodeData = {
            index: 1,
            x: 100,
            y: 100,
            left: null,
            right: null,
            father: null,
            mother: null,
            spouse: null,
            details: { name: "", age: "", dob: "", dod: "" }
          };

          // Send a POST request to save the first node to the backend
          const addFirstNodeResponse = await axios.post('http://localhost:5000/api/nodes', firstNodeData);
        //   setNodes([addFirstNodeResponse.data]);
          setNodes((prevNodes) => [...prevNodes, addFirstNodeResponse.data]);
          
          // You might want to perform additional actions after adding the first node
        }
      } catch (error) {
        console.error('Error fetching or adding nodes:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    nodes.forEach((node) => {
      console.log('Node Index:', node.index);
      console.log('Node Details:', node.details);
    })
    
  }, [nodes]);

  
const addNodeToBackend = async (newNodeData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/nodes', newNodeData);
      // setNodes((prevNodes) => [...prevNodes, response.data]);
      const updatedNode = { ...response.data, index: nodes.length + 1 };

    // Update the state with the new node
    setNodes((prevNodes) => [...prevNodes, updatedNode]);
    } catch (error) {
      console.error('Error adding node:', error);
    }
  };
  
  const updateNodeInBackend = async (nodeId, updatedNodeData) => {
      try{await axios.put(`http://localhost:5000/api/update/nodes/${nodeId}`, updatedNodeData);
    //   // Update state after the API call is successful
      setNodes((prevNodes) =>
        prevNodes.map((node) => (node.index === nodeId ? { ...node, ...updatedNodeData } : node))
      );
    } catch (error) {
      console.error('Error updating node:', error);
    }
  };

  const handleNodeClick =async (clickedNode) => {
    console.log(`Clicked Node Coordinates: (${clickedNode.x}, ${clickedNode.y})`);
    console.log(`Clicked Node Index: ${clickedNode.index}`);
    console.log(clickedNode.details);
    if (clickedNode.spouse) {
      console.log(`Clicked Spouse Node Coordinates: (${clickedNode.spouse.x}, ${clickedNode.spouse.y})`);
      console.log(`Clicked Spouse Node Index: ${clickedNode.spouse.id}`);
    }

    // Set the selected node for displaying details
    
    setSelectedNode(clickedNode);
    setSelectedNodeDetails(clickedNode.details);
    setDetailsPosition({ x: clickedNode.x, y: clickedNode.y });
    

    // // Open the edit form for the clicked node
    // setEditedNode(clickedNode);
    // setFormVisible(true);

    if (editMode) {
      // Open the edit form for the clicked node
      setFormVisible(true);
      setEditedNode(clickedNode);
    } else {
      // Toggle between adding parents, adding child nodes, and adding spouse
      if (addParentsMode) {
        const isLeft = clickedNode.father === null;
        const xOffset = isLeft ? -40 : 40;

        const newChild = {
          index: nodes.length + 1,
          x: clickedNode.x + xOffset,
          y: clickedNode.y - 40,
          left: null,
          right: null,
          spouse: null,
          father: null,
          mother: null,
          details: { name: "", age: "", dob: "", dod: "" }
        };

        // Connect the new node to the clicked node
        if (isLeft) {
            updateNodeInBackend(clickedNode.index, { father: newChild });
            clickedNode.father = newChild;
          } else {
            updateNodeInBackend(clickedNode.index, { mother: newChild });
            clickedNode.mother = newChild;
          }
          addNodeToBackend(newChild);
    
    setAddParentsMode(prevAddParentsMode => !prevAddParentsMode);

      } else if (addChildMode) {
        const isLeft = clickedNode.left === null;
        const xOffset = isLeft ? -40 : 40;

        const newChild = {
          index: nodes.length + 1,
          x: clickedNode.x + xOffset,
          y: clickedNode.y + 40,
          left: null,
          right: null,
          spouse: null,
          father: null,
          mother: null,
          details: { name: "", age: "", dob: "", dod: "" }
        };

        // Connect the new node to the clicked node
        if (isLeft) {
            updateNodeInBackend(clickedNode.index, { left: newChild });
          clickedNode.left = newChild;
        } else {
            updateNodeInBackend(clickedNode.index, { right: newChild });
          clickedNode.right = newChild;
        }
        addNodeToBackend(newChild);
        
   
    setAddChildMode(prevAddChildMode => !prevAddChildMode);
      } else if (addSpouseMode) {
        if (clickedNode && clickedNode.details) {
          const newSpouse = {
            index: nodes.length + 1,
            x: clickedNode.x + 60,
            y: clickedNode.y,
            left: null,
            right: null,
            father: null,
            spouse: clickedNode,
            details: { name: "", age: "", dob: "", dod: "" },
          };
  
          // Update the details of the clicked node before adding the spouse
          const updatedNodeDetails = { ...clickedNode.details, name: "Updated Name" };
          await updateNodeInBackend(clickedNode.index, { details: updatedNodeDetails });
  
          // Update the spouse node with the new details
          updateNodeInBackend(newSpouse.index, { details: newSpouse.details });
  
          // Update the clicked node with the spouse information
          updateNodeInBackend(clickedNode.index, { spouse: newSpouse });
  
          // Add the new spouse node
          addNodeToBackend(newSpouse);
  
          setSelectedNode(newSpouse);
        }
  
        setSpouseMode((prevAddSpouseMode) => !prevAddSpouseMode);
      }
    }
  };
  
const handleEditClick = (clickedNode) => {
    setEditedNode(clickedNode);
    setFormVisible(true);
    setEditMode(true);
  };
const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to update the details of the edited node
      await updateDetailsNodeInBackend(editedNode.index, { details: editedNode.details });
      console.log("Updated Node Details:", editedNode.details);
      setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.index === editedNode.index ? { ...node, details: editedNode.details } : node
      )
    );
      
    //   setSelectedNode(null);
      setEditMode(false);
      setFormVisible(false);
      setEditedNode(null);
    } catch (error) {
      console.error('Error updating node details:', error);
    }
  };
  const updateDetailsNodeInBackend = async (nodeId, updatedNodeData) => {
    try {
        await axios.put(`http://localhost:5000/api/update/nodes/${nodeId}`, {
            details: updatedNodeData.details,
        });

        // Update the nodes array with the updated details
    } catch (error) {
        console.error('Error updating node:', error);
        throw error; // Propagate the error to handle it in the calling function if needed
    }
};

  const handleZoomIn = () => {
    setZoomLevel(Math.min(2, zoomLevel + 0.1)); // Adjust max zoom level as needed
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(0.1, zoomLevel - 0.1)); // Adjust min zoom level as needed
  };

  const handleSvgDrag = (e) => {
    setSvgTranslate({
      x: svgTranslate.x + e.movementX / zoomLevel,
      y: svgTranslate.y + e.movementY / zoomLevel,
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setSvgTranslate({ x: 0, y: 0 });
  };



const handleDelete = async (clickedNode) => {
    try {
      // Make an API call to delete the node from the backend
      await axios.delete(`http://localhost:5000/api/delete/nodes/${clickedNode.index}`);
      
      // Update the state to remove the node
      if (Array.isArray(nodes)) {
        const updatedNodes = deleteSubtree([...nodes], clickedNode);
        setNodes(updatedNodes);
        setSelectedNode(null);
      }
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  const deleteSubtree = (nodes, nodeToDelete) => {
    const findAndDelete = (currentNode) => {
      if (!currentNode) return null;

      if (currentNode === nodeToDelete) {
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
    if (!currentNode || currentNode.x === undefined || currentNode.y === undefined) return null;

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
        <TreeNode x={currentNode.x} y={currentNode.y} 
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
            onDelete={() => handleDelete(currentNode.spouse) }
            />
          </React.Fragment>
        )}
        {/* {selectedNode && (

            <NodeDetails details={selectedNode}  position={detailsPosition}/>
        )} */}
      </React.Fragment>
    );
  };

  return (
    <>
      <section>

        <div className="page-container">
        

          <div className="right-buttons">
            <button className="right-btn">unlimited</button>
            <button className="right-btn">4G Ago</button>
            <button className="right-btn " >3G Ago</button>
            <button className='right-btn' >2G Ago</button>
          </div>

          <div className="right2-buttons" style={{ marginTop: "310px" }} >
          <button className='right2-btn' onClick={() => handleDelete(selectedNode)}>Delete</button>
            {/* <button className="right2-btn"><FontAwesomeIcon icon={faGear} /></button> */}
            <button className="right2-btn" ><FontAwesomeIcon icon={faContactCard} /></button>
            <button className="right2-btn" ><FontAwesomeIcon icon={faUsersViewfinder} /></button>
          </div>

          <div  style={{ marginTop: "-620px" }} >
            <button className="left-btn" onClick={() => setAddChildMode(!addChildMode)}>child</button>
            <button className="left-btn" onClick={() => setSpouseMode(!addSpouseMode)}>spouse</button>
            <button className="left-btn " onClick={() => setAddParentsMode(!addParentsMode)}>Parents</button>
            <button className="left-btn " onClick={() => { setEditMode(true); setEditedNode(selectedNode); }} >Edit</button>
          </div>

          <div  style={{ marginTop: "320px" }} >
            <button className="left2-btn" onClick={handleZoomIn}><FontAwesomeIcon icon={faPlus} /></button>
            <button className="left2-btn " onClick={handleZoomOut}><FontAwesomeIcon icon={faMinus} /></button>
            <button className='left2-btn'onClick={handleResetZoom} ><FontAwesomeIcon icon={faLocation} /></button>
          </div>

          {nodes.map((node) => (
            <div
              key={node.index}
              style={{
                position: 'absolute',
                top: `${node.y + 200}px`,
                left: `${node.x + 580}px`,
                border: '1px solid black',
                padding: '2px',
                marginTop: '5px',
                borderRadius: '5px',
                backgroundColor: 'white',
                zIndex: 1,
                display: 'flex',
              }}
            >
              <p style={{ margin: '-2px 0', fontSize: '10px' }}>{node.details.name}</p>
              <p style={{ margin: '-2px 0', fontSize: '10px' }}>{node.details.age}</p>
              {/* {node.details && (
              <>
                <p style={{ margin: '-2px 0', fontSize: '10px' }}>{node.details ?.name}</p>
                <p style={{ margin: '-2px 0', fontSize: '10px' }}>{node.details ?.age}</p>
              </>
            )} */}
            </div>
          ))}; 
          
            {nodes.map((node) => (
            <TreeNode
              key={node.index}
              x={node.x}
              y={node.y}
              onClick={() => handleEditClick(node)}
            />
          ))}
            {editMode && formVisible && (
            <div className="form-container">
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
            </div>
            )}

          {/* Family Tree */}
          {/* <svg width="200" height="200" className="central-circle">
            {renderTree(nodes[0])}
          </svg> */}
          <svg
            width="200"
            height="200"
            className="central-circle"
            style={{
              transform: `scale(${zoomLevel}) translate(${svgTranslate.x}px, ${svgTranslate.y}px)`,
            }}
            onMouseMove={(e) => svgTranslate.x && handleSvgDrag(e)}
          >
            {renderTree(nodes[0])}
          </svg>

        </div>

      </section>

    </>
  );
}

export default HomePage;

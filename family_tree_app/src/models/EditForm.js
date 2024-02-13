// EditForm.js
import React from 'react';

const EditForm = ({ editedNode, setEditedNode, handleEditSubmit }) => (
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
);

export default EditForm;

// TreeEditorPage.js
import React, { useState } from 'react';
import TreeEditor from './TreeEditor';

const TreeEditorPage = ({ selectedNode, onAddParents, onAddChild, onAddSpouse, onEdit, onSubmit, onCancel }) => {
  const [addParentsMode, setAddParentsMode] = useState(false);
  const [addChildMode, setAddChildMode] = useState(false);
  const [addSpouseMode, setSpouseMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <button onClick={() => onAddParents(selectedNode)}>
        {addParentsMode ? 'Adding Parents' : 'Add Parents'}
      </button>
      <button onClick={() => onAddChild(selectedNode)}>
        {addChildMode ? 'Adding Child' : 'Add Child'}
      </button>
      <button onClick={() => setSpouseMode(!addSpouseMode)}>
        {addSpouseMode ? 'Adding Spouse' : 'Add Spouse'}
      </button>
      <button onClick={() => setEditMode(!editMode)}>
        Edit
      </button>
      <TreeEditor
        editMode={editMode}
        addParentsMode={addParentsMode}
        selectedNode={selectedNode}
        onSubmit={onSubmit}
        onCancel={() => { onCancel(); setEditMode(false); setAddParentsMode(false); setAddChildMode(false); setSpouseMode(false); }}
      />
    </>
  );
};

export default TreeEditorPage;

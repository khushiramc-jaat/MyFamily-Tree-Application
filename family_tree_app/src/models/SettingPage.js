import React, { useState } from 'react';
import "./SettingPageStyle.css"

const SettingPage = () => {
  const [locked, setLocked] = useState(false);
  const [showName, setShowName] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [showAddition, setShowAddition] = useState(true);
  const [buttonSize, setButtonSize] = useState('large');

  const toggleLock = () => {
    setLocked(!locked);
  };

  const toggleShowName = () => {
    setShowName(!showName);
  };

  const toggleShowAge = () => {
    setShowAge(!showAge);
  };

  const toggleShowAddition = () => {
    setShowAddition(!showAddition);
  };

  const toggleButtonSize = () => {
    setButtonSize((prevSize) => (prevSize === 'large' ? 'small' : 'large'));
  };

  const handleDateFormat = () => {
    // Perform Date Format logic
    console.log('Date Format clicked');
  };

  const handleNameOrder = () => {
    // Perform Name Order logic
    console.log('Name Order clicked');
  };

  const handleGtoF = () => {
    // Perform G-F logic
    console.log('G to F clicked');
  };

  const handleFtoG = () => {
    // Perform F-G logic
    console.log('F to G clicked');
  };

  return (
    <div className={`page-container ${buttonSize}`}>
      <div className="button-row">
        <button>Family Tree</button>
        <button onClick={toggleLock}>{locked ? 'Unlock' : 'Lock'}</button>
        <button onClick={toggleShowName}>{showName ? "Don't Show Name" : 'Show Name'}</button>
        <button onClick={toggleShowAge}>{showAge ? "Don't Show Age" : 'Show Age'}</button>
        <button onClick={toggleShowAddition}>
          {showAddition ? "Don't Show Addition" : 'Show Addition'}
        </button>
        <button onClick={toggleButtonSize}>Button Size: {buttonSize}</button>
        <button onClick={handleDateFormat}>Date Format</button>
        <button onClick={handleNameOrder}>Name Order</button>
        <button onClick={handleGtoF}>G-F</button>
        <button onClick={handleFtoG}>F-G</button>
      </div>
      <div className="family-tree-container">
        {/* Family Tree component goes here */}
      </div>
    </div>
  );
};

export default SettingPage;

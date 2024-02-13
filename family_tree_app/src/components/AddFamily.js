import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash,faArrowUpFromBracket,faArrowDown,faFileCirclePlus} from '@fortawesome/free-solid-svg-icons'
import "./AddFamilyStyle.css"
import { useState } from 'react'

function AddFamily() {
    const [isButtonClicked, setIsButtonClicked] = useState(0);
    const[buttons,setButtons]=useState([]);
    const navigate=useNavigate();

    const handleButtonClick = () => {
        const newButtonId = buttons.length + 1;
        const newButton = (
          <div key={newButtonId}>
            
            <button onClick={() => handleButtonClick()}><FontAwesomeIcon icon={faFileCirclePlus} /> {newButtonId}</button>
          </div>
        );
        navigate("/homePage");
        setButtons([...buttons, newButton]);
      };

      const handleDeleteLast = () => {
        if (buttons.length > 0) {
          // Copy the buttons array and remove the last button
          const updatedButtons = [...buttons];
          updatedButtons.pop();
          setButtons(updatedButtons);
        }
      };





    //   const deleteButtonClick=()=>{
    //     const buttonId=buttons.legth +1;
    //     <button  onClick={() => handleDelete(buttonId)}></button>

    //   }
    
    //   const handleDelete = (buttonId) => {
    //     // Filter out the button with the specified key
    //     const updatedButtons = buttons.filter((button) => {
    //       return button.key !== buttonId.toString();
    //     });
    
    //     setButtons(updatedButtons);
    //   };

    return (
        <section>
            <div className='familt-data'>
                <div className="button-container">
                    <button className="form-btn" id="delete_btn" onClick={handleDeleteLast}><FontAwesomeIcon icon={faTrash} /></button>
                    <button className="form-btn"><FontAwesomeIcon icon={faArrowDown} /></button>
                    <button className="form-btn"><FontAwesomeIcon icon={faArrowUpFromBracket} /></button>
                    
                    
                </div>
                <div className='Add-container'>
                <button className='data-btn' onClick={handleButtonClick}><FontAwesomeIcon icon={faFileCirclePlus} /></button>
                <h6 className='new-data'>New Data</h6>
                <div>{buttons}</div>
               
                </div>
            </div>
        </section>
      );
}

export default AddFamily

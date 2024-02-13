import React from 'react'
import "./Frontpage.css"
import img1 from "./images/familytreeImage.jpg"
import { useNavigate } from 'react-router-dom'


function FrontPage() {
   const navigate=useNavigate()
    const loginuser=()=>{
       navigate("/login")
    }
    const signupuser=()=>{
        navigate("/register")
     }
  return (
    <div className="container">
      <h1>Welcome to Our Family Tree App</h1>
      <img
        src={img1}
        alt="Family Tree Application"
        className="family-tree-image"
      />
      <div className="buttons">
        <button className="login-btn" onClick={loginuser}  >Login</button>
        <button className="signup-btn" onClick={signupuser}>Signup</button>
      </div>
    </div>
  )
}

export default FrontPage

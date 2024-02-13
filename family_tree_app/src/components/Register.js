import React from 'react'


import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import "./mix.css"
import { useState } from 'react';

const Register = () => {

    const [passShow,setPassShow] = useState(false);
    const [cpassShow,setcPassShow] = useState(false);
    const navigate=useNavigate();

    const [inpval,setInpval] = useState({
        fname:"",
        email:"",
        password:"",
        cpassword:""

    });
   
      const setVal = (e)=>{
        //console.log(e.target.value);
        const {name,value}=e.target;
         setInpval(()=>{
            return{
                ...inpval,
                [name]:value
            }

         })
    };

    const addUserdata =async(e)=>{
        e.preventDefault();
        const{fname,email,password,cpassword}=inpval;

        if(fname ==""){
            alert("please enter your name");
        }else if(email ==""){
            alert("please enter your email");
        }else if(!email.includes("@")){
            alert("enter valid email");
        }else if(password==""){
            alert("enter your pasword");
        }else if(cpassword==""){
            alert("enter your confirm pasword");
        }
        else if(password.length < 6){
            alert("confirm password must be 6 char")
        }
        else if(cpassword.length < 6){
            alert("password must be 6 char")
        }else if(password != cpassword){
            alert("password and conofirm password not match");
        }
        else{
            console.log("user registration succesful done");
           await fetch("http://localhost:5000/register",{
                method:"POST",
                crossDomain:true,
                headers:{
                    "Content-Type":"application/json",
                    Accept:"application/json",
                    "Access-Control-Allow-origin":"*",
                },
               
                body:JSON.stringify({
                    fname,
                    email,
                    password,
                    cpassword,
                }),
            })
            .then((res)=>res.json())
            .then((data)=>{
                //console.log(data,"userRegister");
                if(data.status==201){
                    // alert("user registration done");
                    navigate("/addFamily")
                    setInpval({...inpval,fname:"",email:"",password:"",cpassword:""})
                }
            });

            
        }

    }


  return (
   <>
    <section>
        <div className="form_data">
            <div className="form_heading">
                <h1>Sign Up</h1>
                <div id="recaptcha-container"></div>
                
            </div>

            <form>
                <div className='form_input'>
                    <label htmlFor="fname">Name</label>
                    <input type="text" onChange={setVal} value={inpval.fname} name="fname" id="fname" placeholder='Enter Your Name'/>
                </div>
                <div className='form_input'>
                <label htmlFor="email">Email</label>
                <input type="email" onChange={setVal} value={inpval.email}
                name="email" id="email" placeholder='Enter Your Email Address'/>
                </div>

               
                
                 <div className='form_input'>
                    <label htmlFor="password">Password</label>
                    <div className="two">
                        <input type={!passShow ? "password":"text"} onChange={setVal}value={inpval.password}
                        name="password" id="password" placeholder='Enter Your password'/>
                        <div className="showpass" onClick={()=>setPassShow(!passShow)}>
                            {!passShow ? "Show" : "Hide"}
                        </div>
                    </div>
                 </div>

                 <div className='form_input'>
                    <label htmlFor="password"> Confirm Password</label>
                    <div className="two">
                        <input type={!cpassShow ? "password":"text"} value={inpval.cpassword}
                        onChange={setVal}
                        name="cpassword" id="cpassword" placeholder='Enter Your confirm password'/>
                        <div className="showpass" onClick={()=>setcPassShow(!cpassShow)}>
                            {!cpassShow ? "Show" : "Hide"}
                        </div>
                    </div>
                 </div>

                
                <button className='btn'onClick={addUserdata}>Sign Up</button>
                <p>Already have an account? < NavLink to="/login">Login</ NavLink></p>
                
            </form>
        </div>
    </section>
   
   </>
  )
}

export default Register

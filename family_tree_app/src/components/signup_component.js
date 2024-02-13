import React,{Component} from "react";
import app from "./firebase_config";
import { getAuth, RecaptchaVerifier ,signInWithPhoneNumber} from "firebase/auth";

const auth = getAuth(app);
export default class SignUP extends Component{
   constructor(props){
        super(props);
        this.state={
            fname:"",
            mobileNo:"",
            password:"",
            //verifyButton:false,
            verifyOtp: false,
            otp:"",
            verified:false,
        };
        this.handleSubmit=this.handleSubmit.bind(this);
        this.onSignInSubmit=this.onSignInSubmit.bind(this);
        this.verifyCode=this.verifyCode.bind(this);
    }

    onCaptchVerify(){
        
        window.recaptchaVerifier = new RecaptchaVerifier( auth,'recaptcha-container', {
            size: 'invisible',
            callback: (response) => {
                this.onSignInSubmit();
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // ...
            },
        },
        );
    }

    onSignInSubmit(){
        this.onCaptchVerify();
        const phoneNumber ="+91"  + this.state.mobileNo;
        console.log(phoneNumber);
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        alert("otp sended");
        this.setState({verifyOtp : true});
        // ...
        }).catch((error) => {
        // Error; SMS not sent
        // ...
        });
    }

    verifyCode(){
        window.confirmationResult.confirm(this.state.otp).then((result) => {
            // User signed in successfully.
            const user = result.User;
            console.log(user);
            alert("Verification done");
            this.setState({
                verified: true,
                verifyOtp:false
            });
            // ...
          })
          .catch((error) => {
            alert("Invalid otp");
            // User couldn't sign in (bad verification code?)
            // ...
          });
    }

    /*changeMobile(e) {
        e.preventDefault();
        this.setState({mobileNo:e.target.value} , fuction() {
            if( this.state.mobileNo==10 ){
                this.setState({
                    verifyButton:true
                });
            }
        });

    }*/

    handleSubmit(e){
        e.preventDefault();
        const{fname,mobileNo,password}=this.state;
        console.log(fname,mobileNo,password);
        fetch("http://localhost:5000/signup",{
                method:"POST",
                crossDomain:true,
                headers:{
                    "Content-Type":"application/json",
                    Accept:"application/json",
                    "Access-Control-Allow-origin":"*",
                },
                body:JSON.stringify({
                    fname,
                    email:mobileNo,
                    password,
                }),
               
            })
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data,"userRegister");
                /*if(data.status==201){
                    alert("user registration done");
                    setInpval({...inpval,fname:"",email:"",password:"",cpassword:""})
                }onSubmit={this.handleSubmit
                    onChange={(e) => this.setState({fname:e.target.value})}*/
            });
    }

    render(){
        return (
            <section>
                <div className="form_data">

                <form onSubmit={this.handleSubmit}>
                    <h3>Sign Up</h3>
                    <div id="recaptcha-container"></div>
                <div className='form_input'>
                    <label htmlFor="fname">Name</label>
                    <input type="text" onChange={(e) => this.setState({fname:e.target.value})}  name="fname" id="fname" placeholder='Enter Your Name'/>
                </div>
                <div className='form_input'>
                <label htmlFor="mobileNo">mobileNo</label>
                <input type="text" onChange={ (e)=>this.setState({mobileNo:e.target.value})} 
                name="mobileNo" id="mobileNo" placeholder='Enter Your mobile number'/>
                <input type="button" onClick={this.onSignInSubmit} value="Verify" className='btn'/>
                </div>

                <div className='form_input'>
                <label htmlFor="OTP">OTP</label>
                <input type="text"  
                placeholder='Enter OTP'/>
                <input type="button" value='OTP' onClick={this.verifyCode} className='btn'/>
                </div>

               
                
                 <div className='form_input'>
                    <label htmlFor="password">Password</label>
                    <div className="two">
                        <input type="text" onChange={(e) => this.setState({password:e.target.value})}
                        name="password" id="password" placeholder='Enter Your password'/>
                    </div>
                 </div>
         
         
                            <button type="submit" onClick={this.handleSubmit} className='btn'>Sign Up</button>
                     
                     </form>
                     </div>
                     </section>
        )
    }
}
import React, { useState } from 'react'
import '../css/forgot.css'
import firebase from '../firebase-config';
import { Link, useNavigate  } from 'react-router-dom';

export default function ForgotPass({
    setIsForgot
}) {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const HandleResetPassword = (email)=>{
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          alert("Password reset email sent");
          setIsForgot(false);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
    }
   
  return (
    <div className='forgot-container'>
        <div className='forgot'>
            <h1 style={{marginBottom:"23px", fontSize:"23px"}}>Forgot password?</h1>
            <input type="email" onClick={(e) => setEmail(e.target.value)} placeholder='Email'/>
            <button className='login-btn register-btn' onClick={() => {HandleResetPassword(email)}}>Reset Password<i class="fa-solid fa-arrow-right"></i></button>
        </div>
    </div>
  )
}

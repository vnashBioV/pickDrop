import React, { useState } from 'react'
import logo from '../icons/we-tracking-logo.png';
import firebase from '../firebase-config';
import { Link, useNavigate  } from 'react-router-dom';
import '../css/login.css'
import ForgotPass from '../componets/ForgotPass';
import LoginAlert from '../componets/LoginAlert';

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType,  setUserType] = useState("");
    const navigate = useNavigate();
    const [isForgot, setIsForgot] = useState(false);
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const authenticateUser = (e) =>{
      e.preventDefault()
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        var uid = user.uid;
        firebase.database().ref('/pickDropParty/' + uid).once('value', (snapshot) => {
          if(snapshot.exists()){
            navigate('/')
          }else{
            setErrorMessage("This is not the right platform for this user type")
            setAlert(true)
          }
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage === "The password is invalid or the user does not have a password." || errorMessage === "There is no user record corresponding to this identifier. The user may have been deleted."){
          setErrorMessage("The email or password you entered is incorrect, Try again or reset your password")
        }else if(email === "" || password === ""){
          setErrorMessage("Please enter your login details")
        }
        setAlert(true)
        // setTimeout(() => {
        //   setAlert(false);
        // }, 1000)
      });
  }


  return (
    <div className='login' style={{height:"100vh"}}>
        <form action="" className='login-form'>
            <div className='header-container'>
              <h1 className='heading-text-login' style={{fontSize:"35px", marginBottom:"14px"}}>Sign in</h1>
            </div>
            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
            <button className='login-btn register-btn' onClick={authenticateUser}>Login <i class="fa-solid fa-arrow-right"></i></button>
            <p className='forgot-par' onClick={() => {
              // alert('hey hey')
              setIsForgot(true);
            }}>Forgot password</p>
            <h2 style={{color:"black"}}>or</h2> <Link to='/registration' style={{color:"#474747"}} >Create an account</Link>
        </form>
        {isForgot && 
          <ForgotPass setIsForgot={setIsForgot}/>
        }
        {alert &&
          <LoginAlert setAlert={setAlert}>
            <div>{errorMessage}</div>
          </LoginAlert>
        }
    </div>
  )
}

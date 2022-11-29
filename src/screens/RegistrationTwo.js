import React, { useState, useEffect, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import firebase from '../firebase-config';
import { useForm } from "react-hook-form";
import '../css/registrationtwo.css'
import LoginAlert from '../componets/LoginAlert';

export default function RegistrationTwo() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = (data) => {
    firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user
            var uid = user.uid;
            const email = user.email;
            firebase.database().ref('/pickDropParty/' + uid).set({
              ...data,
              user_type: 'pick drop party'
            })
            // alert("Registration successful please go and login!")
            navigate('/')
          })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // setErrorMessage(errorMessage)
          
          if (errorMessage === "The email address is already in use by another account."){
            setErrorMessage("This email address is already attached to an existing account, would you like to log in instead?")
          }
          setAlert(true)
          // ..
        });
  }
  return (
    <div className='registration'>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign Up</h1>
            <input 
                type="text" 
                name='FirstName' 
                placeholder='First Name'
                {...register("firstName", { required: true })}
              />
              {errors.firstName && <p>Please don't leave the first name blank</p>}
            <input 
                type="text" 
                name='LastName' 
                placeholder='Last Name'
                {...register("lastName", { required: true })}
            />
            {errors.lastName && <p>Please don't leave the last name blank</p>}
            <input 
                type="text" 
                name="CompanyName" 
                placeholder='Company Name'
                {...register("companyName", { required: true })}
            />
            {errors.companyName && <p>Please don't leave the company name blank</p>}
            <input 
                type="text" 
                name='Email' 
                placeholder='Email'
                {...register("email", { 
                  required: true,  
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
              })}
            />
            {errors.email && <p>Please check Email format</p>}
            <input 
                type="tel" 
                name='PhoneNumber' 
                placeholder='Phone Numbers'
                {...register("phoneNumber", { required: true })}
            />
            {errors.phoneNumber && <p>Please don't leave the phone number blank</p>}
            <input 
                type="password" 
                name='password'
                placeholder='Password'
                {...register("password", { 
                  required: true, 
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
              })}
            />
            {errors.password && <p>Please create strong password</p>}
            <button type="submit">Register</button>
            <p>or</p>
            <Link style={{marginTop: "13px"}} to="/login">Login</Link>
        </form>
        {alert &&
          <LoginAlert setAlert={setAlert}>
            <div>{errorMessage}</div>
          </LoginAlert>
        }
    </div>
  )
}

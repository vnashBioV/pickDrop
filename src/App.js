import './App.css';
import React, {useState, useEffect,} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomeTracking from './screens/HomeTracking'
import Login from './screens/Login';
import RegistrationTwo from './screens/RegistrationTwo';

function App() {
  return (
    <div className='app'>
        <BrowserRouter>
          <Routes>
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/registration' element={<RegistrationTwo/>} />
            <Route exact path='/' element={<HomeTracking/>} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

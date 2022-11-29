import React from 'react'
import '../css/alertLogin.css'

export default function LoginAlert({
children,
setAlert
}) {
  return (
    <div className='login-alert'>
        {children}
        <button className='alert-btnn' onClick={() => {setAlert(false)} }>Ok</button>
    </div>
  )
}

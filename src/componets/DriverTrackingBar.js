import React, {useState, useEffect} from 'react'
import firebase from '../firebase-config';
import {Avatar} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import '../css/progressbar.css'

function DriverTrackingBar({
  fleet,
  fleetName,
  booking,
  progValue,
  setProgValue,
  actualLoads
}) {
    const [wholeValue, setWholeValue] = useState(101);
    const [decValue, setDecValue] = useState(101);
    console.log("the progress value", wholeValue);
    useEffect(() => {
       const progress = [20, 40, 60,80,100]
        for (var i = 0; i < actualLoads; i++){
           console.log("This is the decreasing prog", i - decValue)
        }
    },[])
  return (
        <div className='driver-tracking-bar-container'>
            <div className='driver-profile'>
                <div>
                    <div>
                        <Avatar className='Enterprise-icon'>{fleetName.toString().toUpperCase().substring(0,2)}</Avatar>                    
                    </div>
                    <div>
                        <h1>{fleetName}</h1>
                        <p>Trip ID: {booking.booking_ref}</p>
                    </div>
                </div>
                <div>
                    <p>vehicle type</p>
                </div>
            </div>
            <div className='progress-bar-comp'>
              <div className='progress-perc' style={{width:`${actualLoads}%`}}>

              </div>
            </div>
        </div>
  )
}
export default React.memo(DriverTrackingBar)

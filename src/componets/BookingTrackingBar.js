import firebase from 'firebase';
import React, {useState, useEffect, useRef} from 'react'
import DriverTrackingBar from './DriverTrackingBar';
import { v4 as uuidv4 } from 'uuid';

export default function BookingTrackingBar({
    booking,
    setSingleBook,
    singleBook,
    actualLoads

}) {
    const [fleetForBooking, setFleetForBooking] = useState(booking.booking_bids_fleet_id);
    const [showTrackBar, setShowTrackBar] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
    const [progValue, setProgValue] = useState();

    // console.log("The booking on the booking tracking bar", booking.actual_loads_for_cargo)
  return (
    <div>
        <div className='this-booking'>
            {/* <div className='book-populate' onClick={() => {
                setSingleBook([booking])
                setProgValue(booking.actual_loads_for_cargo)
            }}>
                <h2>{booking.booking_ref}</h2>
                <p>{booking.puDetails.puCityName} to {booking.doDetails.doCityName}</p>
            </div>
            <div className="arrow-block" onClick={() => {
                if(showTrackBar){
                    setShowTrackBar(false)
                    setShowArrow(false)
                }else{  
                    setShowTrackBar(true)
                    setShowArrow(true)
                }
            }}>
                <i className={!showArrow ? "fa-solid fa-angle-down" : "fa-solid fa-angle-up"}></i>
            </div> */}
        </div>
        <div>
            {fleetForBooking ? fleetForBooking.map((fleet, id) => {
                    var name = []
                    firebase.database().ref('/fleets/' + fleet).on('value', (snapshot) => {
                        name.push(snapshot.val().fleet_name)
                    })
                    return(
                        <>
                        {showTrackBar ? 
                            <DriverTrackingBar
                                fleet={fleet}
                                key={uuidv4()}
                                fleetName={name}
                                booking={booking}
                                progValue={progValue}
                                setProgValue={setProgValue}
                                actualLoads={actualLoads}
                            />
                            :<></>
                        }
                        </>
                    )
            })
            : <></>
            }
        </div>
    </div>
    
  )
}

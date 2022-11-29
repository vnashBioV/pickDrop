/*global google*/
import React, {useState, useEffect, useRef} from 'react'
import firebase from '../firebase-config';
import { Link, useNavigate  } from 'react-router-dom';
import '../css/bidding.css'
import '../css/tracking.css'
import filterIcon from '../icons/bars.png'
import downIcon from '../icons/download-pdf.png'
import {Avatar} from '@mui/material';
import printIcon from '../icons/awesome-print.png'
import chatIcon from '../icons/chat.png';
import { v4 as uuidv4 } from 'uuid';
import DriverTrackingBar from '../componets/DriverTrackingBar'
import BookingTrackingBar from '../componets/BookingTrackingBar';
import ReactToPdf from 'react-to-pdf';
import emptyIcon from '../icons/box.png'
import axios from 'axios'
import tone from "../tones/messenger_seri.mp3";
const haversine = require('haversine')



// import PdfComponent from './PdfComponent'

function TrackingPage() {
    const [userEmail, setUserEmail] = useState("");
    const [company, setCompany] = useState("")
    const [telephone, setTelephone] = useState("")
    const [userUid, setUserUid] = useState("")
    const [user, setUser] = useState("")
    const [allBookingInbound, setAllBookingInbound] = useState([])
    const [allBookingOutbooking, setAllBookingOutbooking] = useState([])
    const [bookingDriver, setBookingDriver] = useState([])
    const [outBoundDrivers, setOutBoundDrivers] = useState([])
    const [driverData, setDriverData] = useState([])
    const [userArray, setUserArray] = useState([])
    const [singleBook, setSingleBook] = useState([])
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [documentComp, setDocumentComp] = useState(false);
    const [isInbound, setIsInbound] = useState(false);
    const [isOutbound, setIsOutbound] = useState(false);
    const [inBoundDrivers, setInBoundDrivers] = useState([]);
    const [bookingParty, setBookingParty] = useState([]);
    const [bookingDrivers, setBookingDrivers] = useState([]);
    const [bookingDriversOutbound, setBookingDriversOutbound] = useState([]);
    const [driverDistance, setDriverDistance] = useState([]);
    const [driverHorseId, setDriverHorseId] = useState([]);
    // let driverDistance = 30
    const watchValue = driverDistance
    const [progressValue, setProgressValue] = useState(0);
    const [alert, setAlert] = useState(false);
    const [alertTwo, setAlertTwo] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageTwo, setErrorMessageTwo] = useState("");
    const [testing, setTesting] = useState([]);
    const navigate = useNavigate();
    const [distanceView, setDistanceView] = useState(0)
    const [driverArrived, setDriverArrived] = useState(false);

    const audio = new Audio(tone)

    //get distance
    function initMap(oriLatitude, oriLongitude, desLatitude, desLongitude) {

        const oriCoLat = oriLatitude
        const oriCoLng = oriLongitude
        const coLat = desLatitude
        const colng = desLongitude

        const start = {
            latitude: oriCoLat,
            longitude: oriCoLng
        }
          
        const end = {
            latitude: coLat,
            longitude: colng
        }
        
        return haversine(start, end, {unit: 'meter'});

    }
    useEffect(() => {
            setErrorMessage("Please click the inbound button if you're the pick up, otherwise click the outbound to see the incoming driver")
            setAlert(true);        
    },[])
    
    useEffect(() => {
        console.log("this is the distance", distanceView);
        console.log("selected driver info", singleBook);
        // if(!((singleBook[0]?.driverDistance/1000)/60).toFixed(3) === 974){
        //     // audio.play();
        //     setDriverArrived(true)
        // }
        // audio.play()
    },[])

    const ref = React.createRef();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
                setUser(user)
              var uid = user.uid;
              setUserUid(uid)
                firebase.database().ref('/pickDropParty/' + uid).once('value', (snapshot) => {
                    const company = snapshot.val().companyName
                    setCompany(company)
                    setTelephone(snapshot.val().phoneNumber)
                });
            } else {
                navigate('/login')
            }
        });
    }, [])

    useEffect(() => {
        document.body.style.cssText="margin-top:45px !important";
        return () => {
            document.body.style.marginTop= "0px";
        };      
    }, []);

    // console.log("Inbound booking", allBookingInbound);
    // console.log("the booking driver", inBoundDrivers);
    // console.log("The selected booking", singleBook)
    // console.log("booking drivers", bookingDrivers);
    // console.log("the testing string", testing)
    console.log("this is the outbound", outBoundDrivers)

    return (
    <div className='tracking'>
        <div style={{width:"100%", display:"flex", justifyContent:"end"}}>
            <h1 style={{fontSize:"14px", fontWeight:"normal", cursor:"pointer"}}
                onClick={() => {
                    firebase.auth().signOut().then(() => {
                        navigate('/Login')
                      }).catch((error) => {
                        alert(error)
                      });
                }}
            >
                <i class="fa-solid fa-arrow-right-from-bracket" style={{marginRight:"10px"}}></i>
                Logout
            </h1>
        </div>
        <div className='tracking-child' ref={ref}>
            <div className='left-tracking-info'>
                    <div className='load-shipping'>
                        {bookingParty.length > 0 ? bookingParty.map((booking) => (
                            <div key={booking.phoneNumber}>
                                <p style={{color:"grey"}}>Booking Party</p>
                                <p>{booking.companyName}</p>
                                <p>{booking.email}</p>
                                <p>{booking.phoneNumber}</p>
                            </div>
                        ))
                            : 
                            <div>
                                <p style={{color:"grey"}}>Booking Party</p>
                                <p>Company Name</p>
                                <p>Address</p>
                                <p>CityName</p>
                            </div>
                        }

                        {singleBook.length > 0 ? singleBook.map((single) => (
                            <>
                                <div>
                                    <p style={{color:"grey"}}>Pick-up</p>
                                    <p>{single.puDetails.puCompanyName}</p>
                                    <p>{single.puDetails.puAddress}</p>
                                    <p>{single.puDetails.puCityName}</p>
                                </div>
                                <div>
                                    <p style={{color:"grey"}}>Drop off</p>
                                    <p>{single.doDetails.doCompanyName}</p>
                                    <p>{single.doDetails.doAddress}</p>
                                    <p>{single.doDetails.doCityName}</p>
                                </div>
                            </>
                        ))
                        :<>
                            <div>
                                <p style={{color:"grey"}}>Pick-up</p>
                                <p>Company Name</p>
                                <p>Address</p>
                                <p>CityName</p>
                            </div>
                            <div>
                                <p style={{color:"grey"}}>Drop off</p>
                                <p>Company Name</p>
                                <p>Address</p>
                                <p>CityName</p>
                            </div>
                        </>
                        } 
                    </div>

                    {singleBook.length > 0 ? singleBook.map((single) => (
                        <div className='cargo-cargo'>
                           <div>
                               <p style={{color:"grey"}}>Cargo</p>
                               <p>{single.cargoInformation.productName}</p>
                               <p>SKU: {single.cargoInformation.productCode}</p>
   
                               <p style={{color:"grey", marginTop:"10px"}}>Packaging</p>
                               <div className='package-type-container'>
                                   <div>
                                       <p>Package Type:</p>
                                       <p>Dimensions:</p>
                                       <p>Quantity:</p>
                                       <p>Total Weight:</p>
                                   </div>
                                   <div>
                                       <p>{single.cargoInformation.packageType}</p>
                                       <p>{single.cargoInformation.breadth}cm x {single.cargoInformation.weight}cm x {single.cargoInformation.height}cm</p>
                                       <p>{single.cargoInformation.quantity}</p>
                                       <p>{single.cargoInformation.weight}t</p>
                                   </div>
                               </div>
                               <a target="_blank" href={single.cargoInformation.sdsUrl} className="btn-download">Download SDS <span><img src={downIcon} alt="" /></span></a>
                           </div>
                           <div>
                               <p style={{color:"grey"}}>Vehicle</p>
                               <p>{single.prerequisites?.vehicle_type}</p>
                               <p style={{fontWeight:"bold"}}>{single.driverVehicleInfo?.make}</p>
                                <div className='package-type-container'>
                                   <div>
                                       <p>Net Weight:</p>
                                       <p>Horse:</p>
                                       <p>Trailer:</p>
                                       <p>VIN:</p>
                                   </div>
                                   <div>
                                       <p>34t</p>
                                       <p>{single.driverVehicleInfo?.licence_number}</p>
                                       <p>{single.driverVehicleInfo?.trailer_id}</p>
                                       <p>{single.driverVehicleInfo?.vin_number}</p>
                                   </div>
                               </div>
                               <p style={{ fontsize:"10px", marginTop:"10px", color:"grey"}}>Transit</p>
                               <p style={{fontWeight:"bold"}}>{single.driverDistance ? "In Transit" : "Not In Transit"}</p>
                               <div className='package-type-container'>
                                  <div><p>Estimated Time of Arrival: </p></div>
                                  <div><p>{single.dates_time_selection.end_date_string}</p></div>
                               </div>
                           </div>
                        </div>
                        
                        ))
                        :
                        <>
                        <div className='cargo-cargo'>
                            <div>
                                <p style={{color:"grey"}}>Cargo</p>
                                <p></p>
                                <p>SKU: </p>

                                <p style={{color:"grey", marginTop:"10px"}}>Packaging</p>
                                <div className='package-type-container'>
                                    <div>
                                        <p>Package Type:</p>
                                        <p>Dimensions:</p>
                                        <p>Quantity:</p>
                                        <p>Total Weight:</p>
                                    </div>
                                    <div>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                        <p></p>
                                    </div>
                                </div>
                                <button className="btn-download">Download SDS <span><img src={downIcon} alt="" /></span></button>
                            </div>
                            <div>
                            <p style={{color:"grey"}}>Vehicle</p>
                            <p></p>
                            <p></p>

                            <div className='package-type-container'>
                                <div>
                                    <p>Net Weight:</p>
                                    <p>Horse:</p>
                                    <p>Trailer:</p>
                                    <p>VIN:</p>
                                </div>
                                <div>
                                    <p></p>
                                    <p></p>
                                    <p></p>
                                    <p></p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </>
                        } 

                    <div className='print-block'>
                        <span>
                            <span style={{marginLeft:"10px"}}>
                            <ReactToPdf targetRef={ref} filename=".pdf" x={18} y={1} >
                                {({toPdf}) => (
                                    <p onClick={toPdf} style={{padding:'10px', color:'#fff', background:'grey', borderRadius:"10px", cursor:"pointer", fontSize:"12px"}}>Generate PDF</p>
                                )}
                            </ReactToPdf>
                            </span> 
                        </span>

                        <div style={{marginLeft:"10px", width:"60%", display:"flex", justifyContent:"end", alignItems:"center"}}>
                            <Avatar className='Enterprise-icon'>{company.toUpperCase().substring(0,2)}</Avatar>
                            <span style={{
                                display:"flex",
                                flexDirection:"column",
                                marginLeft:"10px"
                            }}>
                                <p>{company}</p>
                            </span>
                            <span className='chat-ico'>
                                <img src={chatIcon} alt="" />
                            </span>
                        </div>
                    </div>
            </div>
            <div>
                <h1>Overview</h1>
                <div className='bound-btns'>
                    <button onClick={() => {
                        setIsOutbound(false)
                        setIsInbound(true)
                        setErrorMessageTwo("Please click on the avatar to see more information")
                        if(singleBook.length > 0){
                            setAlertTwo(false);
                        }else{
                            setAlertTwo(true)
                        }
                        const bookingRef = firebase.database().ref('booking')
                        bookingRef.once('value', (snapshot) => {
                            if(snapshot.exists()){
                                const inboundbook = Object.values(snapshot.val()).filter((booking) => booking.puDetails.puEmail === userEmail)                                
                                console.log("in bound", inboundbook)
                                setAllBookingInbound(inboundbook);
                                const updated = inboundbook?.map((booking) => {
                                    const bookingDrivers = booking.drivers
                                    console.log("booking drivers", bookingDrivers);
                                    bookingDrivers?.forEach((driver) => {
                                        firebase.database().ref('/drivers/' + driver).on('value', (snapshot) => {
                                            booking.driverData = snapshot.val()
                                            booking.driverName = snapshot.val().name
                                            const driverDate = snapshot.val().date
                                            const driverId = snapshot.val().uid
                                            if(snapshot.val().current_booking_id === booking.booking_id){
                                                const dateForDriver = snapshot.val().calendar[driverDate]
                                                dateForDriver.forEach((datee) => {
                                                    if(datee.booking_id === booking.booking_id ){
                                                        firebase.database().ref('/route/' + driverId).on('value', (snapshot) => {
                                                            const oriCod = snapshot.val().current_location
                                                            booking.driverDistance = parseFloat((initMap(oriCod.latitude, oriCod.longitude, booking.doDetails.coords.latitude, booking.doDetails.coords.longitude)).toFixed(0));
                                                            if((((booking.driverDistance/1000)/60).toFixed(3)) === 0){
                                                                audio.play()
                                                                setDriverArrived(true);
                                                            }
                                                            console.log("distance percent", (booking?.driverDistance/1000)*100)
                                                            setDistanceView(parseFloat((initMap(oriCod.latitude, oriCod.longitude, booking.doDetails.coords.latitude, booking.doDetails.coords.longitude)).toFixed(0)))
                                                        });
                                                    }
                                                })
                                            }    
                                        })
                                    })
                                })
                            }
                        })
                    }}>
                        {isInbound &&
                            <p className='light-bulb'></p>
                        }
                        Inbound
                    </button>
                    <button style={{background:"#fff"}}
                        onClick={() => {
                            setIsOutbound(true)
                            setIsInbound(false)
                            const bookingRef = firebase.database().ref('booking')
                        bookingRef.once('value', (snapshot) => {
                            if(snapshot.exists()){
                                const outboundbook = Object.values(snapshot.val()).filter((booking) => booking.doDetails.doEmail === userEmail)
                                console.log("out bound", outboundbook)
                                setAllBookingOutbooking(outboundbook);
                                const updated = outboundbook?.map((booking) => {
                                    const bookingDrivers = booking.drivers
                                    console.log("booking drivers", bookingDrivers);
                                    bookingDrivers?.forEach((driver) => {
                                        firebase.database().ref('/drivers/' + driver).on('value', (snapshot) => {
                                            booking.driverData = snapshot.val()
                                            booking.driverName = snapshot.val().name
                                            const driverDate = snapshot.val().date
                                            const driverId = snapshot.val().uid
                                            if(snapshot.val().current_booking_id === booking.booking_id){
                                                const dateForDriver = snapshot.val().calendar[driverDate]
                                                dateForDriver.forEach((datee) => {
                                                    if(datee.booking_id === booking.booking_id ){
                                                        firebase.database().ref('/route/' + driverId).on('value', (snapshot) => {
                                                            const oriCod = snapshot.val().current_location
                                                            booking.driverDistance = parseFloat((initMap(oriCod.latitude, oriCod.longitude, booking.doDetails.coords.latitude, booking.doDetails.coords.longitude)).toFixed(0));
                                                            if((((booking.driverDistance/1000)/60).toFixed(3)) === 0){
                                                                audio.play()
                                                                setDriverArrived(true);
                                                            }
                                                            setDistanceView(parseFloat((initMap(oriCod.latitude, oriCod.longitude, booking.doDetails.coords.latitude, booking.doDetails.coords.longitude)).toFixed(0)))
                                                            // console.log("distance percent", (booking?.driverDistance/1000)*100)
                                                        });
                                                    }
                                                })
                                            }    
                                        })
                                    })
                                })
                            }
                        })
                        }}
                    >   
                        {isOutbound &&
                            <p className='light-bulb'></p>
                        }
                        Outbound
                    </button>
                </div>
                <div className='tracking-pannel'>
                    <h1>Tracking</h1>
                    <div className='search-panel'>
                        <input type="text" placeholder='Advanced search'/>
                        {/* <div><img src={filterIcon} alt="" /></div> */}
                    </div>
                    {isInbound &&
                        <>
                            {allBookingInbound.length > 0 ? allBookingInbound.map((booking) => {
                                return(
                                        <div className='bar-container' onClick={() => {
                                            // setSingleBook([booking])
                                            firebase.database().ref('/booking_party/' + booking.booking_party_uid).once('value', (snapshot) => {
                                                setBookingParty([snapshot.val()])
                                            })
                                            const bookingDrivers = booking.drivers
                                            bookingDrivers?.forEach((driver) => {
                                                firebase.database().ref('/drivers/' + driver).on('value', (snapshot) => {
                                                    const horseId = snapshot.val().horse_id
                                                    const fleetId = snapshot.val().fleet
                                                    console.log("this is the horse id from driver", horseId);
                                                    firebase.database().ref('/fleets/' + fleetId).on('value', (snapshot) => {
                                                        console.log("this is the fleet info", snapshot.val());
                                                        const fleethorseId = snapshot.val().horses
                                                        booking.driverVehicleInfo = fleethorseId[horseId]
                                                    })
                                                })
                                            })
                                            setSingleBook([booking])
                                        }}>
                                            <div style={{display:"flex", flexDirection:"row", alignContent:"center", position :"relative"}}>
                                                <Avatar className='Enterprise-icon'>{booking?.driverName?.toString().toUpperCase().substring(0,2)}</Avatar> 
                                                <div className='driverName'>
                                                    <p>{booking?.driverName}</p>  
                                                    <p>Trip ID: {booking?.booking_ref}</p>
                                                </div> 
                                                <div className='truck-type'>{booking.prerequisites?.vehicle_type}</div>                
                                            </div>
                                            <div className='bar-conntainer' style={{background:`${booking?.driverDistance ? "#FFE200" : "#e1e1e1"}`}}>
                                                <div style={{width:`${(booking?.driverDistance/1000)*100}%`, background:`${booking.driverDistance ? "#e1e1e1" : "#FFE200"}`}} className='bar-track'></div>
                                            </div> 
                                            {booking?.driverDistance &&
                                                <p style={{fontSize:"11px", width:"100%", textAlign:"end", marginTop:"6px"}}>{((booking.driverDistance/1000)/60).toFixed(3)} hour/s</p>
                                            }
                                        </div>
                                    )
                            
                            })
                                : <div className='no-contact-added'>
                                    <h1 className='add-contacts'>Currently there are no drivers making their way to you</h1>
                                    <img style={{width:'23%'}} src={emptyIcon} alt="" />
                                </div>
                            }
                        </>
                    }
                    {isOutbound &&
                        <>
                            {allBookingOutbooking.length > 0 ? allBookingOutbooking.map((booking) => {
                                return(
                                    <div className='bar-container' onClick={() => {
                                        // setSingleBook([booking])
                                        firebase.database().ref('/booking_party/' + booking.booking_party_uid).once('value', (snapshot) => {
                                            setBookingParty([snapshot.val()])
                                        })
                                        const bookingDrivers = booking.drivers
                                        bookingDrivers?.forEach((driver) => {
                                            firebase.database().ref('/drivers/' + driver).on('value', (snapshot) => {
                                                const horseId = snapshot.val().horse_id
                                                const fleetId = snapshot.val().fleet
                                                console.log("this is the horse id from driver", horseId);
                                                firebase.database().ref('/fleets/' + fleetId).on('value', (snapshot) => {
                                                    console.log("this is the fleet info", snapshot.val());
                                                    const fleethorseId = snapshot.val().horses
                                                    booking.driverVehicleInfo = fleethorseId[horseId]
                                                })
                                            })
                                        })
                                        setSingleBook([booking])
                                    }}>
                                        <div style={{display:"flex", flexDirection:"row", alignContent:"center", position :"relative"}}>
                                            <Avatar className='Enterprise-icon'>{booking?.driverName?.toString().toUpperCase().substring(0,2)}</Avatar> 
                                            <div className='driverName'>
                                                <p>{booking?.driverName}</p>  
                                                <p>Trip ID: {booking?.booking_ref}</p>
                                            </div> 
                                            <div className='truck-type'>{booking.prerequisites?.vehicle_type}</div>                
                                        </div>
                                        <div className='bar-conntainer' style={{background:`${booking?.driverDistance ? "#FFE200" : "#e1e1e1"}`}}>
                                            <div style={{width:`${(booking?.driverDistance/1000)*100}%`, background:`${booking.driverDistance ? "#e1e1e1" : "#FFE200"}`}} className='bar-track'></div>
                                        </div> 
                                        {booking?.driverDistance &&
                                            <p style={{fontSize:"11px", width:"100%", textAlign:"end", marginTop:"6px"}}>{((booking.driverDistance/1000)/60).toFixed(3)} hour/s</p>
                                        }
                                    </div>
                                    )
                            })
                                : <div className='no-contact-added'>
                                    <h1 className='add-contacts'>Currently there are no drivers making their way to you</h1>
                                    <img style={{width:'23%'}} src={emptyIcon} alt="" />
                                </div>
                            }
                        </>
                    }
                    

                    {/* {allBookingArray.length > 0 ? allBookingArray.filter(item => item.booking_bids_fleet_id).map((booking) =>{
                        fetchDriverDataFnc(booking)
                        return (
                            <div key={uuidv4()} className="driver-container" onClick={() => {
                                setSelectedDriverBook([booking])
                            }}>
                                <div className='driver-profile'>
                                    <div>
                                        <div>
                                            {bookingDriver.length > 0 ? bookingDriver.map((driver) => (
                                                <Avatar className='Enterprise-icon'>{driver.fleet_name.toUpperCase().substring(0,2)}</Avatar>
                                            ))
                                            :  <Avatar className='Enterprise-icon'>DR</Avatar>   
                                            
                                            }
                                            
                                        </div>
                                            {bookingDriver.length > 0 ? bookingDriver.map((driver) => (
                                                <div>
                                                    <h1>{driver.fleet_name}</h1>
                                                    <p>Trip ID: {booking.booking_ref}</p>
                                                </div>
                                                
                                            ))
                                            :  
                                                <div>
                                                    <h1>Fleet Name</h1>
                                                    <p>Trip ID: </p>
                                                </div>
                                            }
                                                                                        
                                    </div>
                                    <div>
                                        <p>{booking.cargoInformation.vehicle_type}</p>
                                    </div>
                                </div>
                                <div className='progress-bar'>
                                    <progress 
                                        value={10} 
                                        max={100} 
                                        className="progress-bars"
                                    />
                                </div>
                            </div>
                        )
                    })
                      : <></>
                    } */}

                    {alertTwo &&
                        <div className='alert-tracking'>
                            <div className='message-alert' style={{width: '62%'}}>
                                <p style={{fontSize:'13px'}}>{errorMessageTwo}</p>
                                <button className='alert-btnn' onClick={() => {setAlertTwo(false)} }>Ok</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
        {/* {documentComp && 
            <PdfComponent singleBook={singleBook} setDocumentComp={setDocumentComp}/>
        } */}
         {alert &&
            <div className='alert-tracking'>
                <div className='message-alert'>
                    <p style={{fontSize:'13px'}}>{errorMessage}</p>
                    <button className='alert-btnn' onClick={() => {setAlert(false)} }>Ok</button>
                </div>
                
            </div>
        }
        {driverArrived && 
           <div className='alert-tracking'>
                <div className='message-alert'>
                    <p style={{fontSize:'13px'}}>Driver has arrived</p>
                    <p style={{fontSize:'12px'}}>Name: {singleBook[0].driverName}</p>
                    <p style={{fontSize:'12px'}}>contact: {singleBook[0].driverData.phone}</p>
                    <button className='alert-btnn' onClick={() => {setDriverArrived(false)} }>Ok</button>
                </div>
            </div>
        }
    </div>
  )
}
export default React.memo(TrackingPage)

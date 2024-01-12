/**
 * A module that uses GoogleMaps API to create a React Component with a map that a user can use to route directions to the restaurant. 
 * @module findStore
 */
import { Container, Button, Nav, CardGroup, Card, Spinner, Alert } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BagItemCard from "../Cards/bagCard";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, DirectionsService, Marker } from '@react-google-maps/api';

// AIzaSyAud1v1zLrlkpIkl6_Q7H_WkLsXRf1tZtg

/**
 * An object containing the width and height of the map imported from Google Maps API
 * Object
 */
const containerStyle = {
  width: '800px',
  height: '600px'
};

/**
 * An object containing the latitude and longitude coordinates to the Panda Express located in the MSC
 * Object
 */
const center = {
  lat: 30.612316337476013,
  lng: -96.34151050347089
};

/**
 * Create and returns a react component with the Google Maps map and an entry for users to enter an address and map it to the store.
 * @param {Object} props - the decoded user payload
 * @returns {Object} - The html for the react component
 */
function FindStore(props) {

  const [isLoading, setLoading] = useState([]);
  const [hasDirections, setHasDirections] = useState(false);
  const [directions, setDirections] = useState({});
  const [originAddress, setOriginAddress] = useState('');
  const [message, setMessage] = useState();
  const [screenText, setScreenText] = useState({});

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAud1v1zLrlkpIkl6_Q7H_WkLsXRf1tZtg"
  })

  const [map, setMap] = React.useState(null)

  useEffect(() => {
    if(localStorage.getItem("translation") != null){
      setScreenText(JSON.parse(localStorage.getItem("translation")));
    }else{
        if(props.auth.user.screenText){
            setScreenText(props.auth.user.screenText);
        }else{
            setScreenText({"Find my Store":"Find my Store", "Enter your address to map to our store.":"Entre your address to map to our store.",
                           "Find Route!":"Find Route!", "is located at:": "is located at:"});
        }
        
    }

    setLoading(false);

  }, []);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    map.setZoom(15);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const calcRoute = () => {

    setHasDirections(true);
    const ds = new google.maps.DirectionsService();
    ds.route(
      {
        origin: originAddress,
        destination: new google.maps.LatLng(30.612316337476013, -96.34151050347089),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        // console.log("status", status);
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log(result);
          setDirections(result);
          setHasDirections(true);
        } else {
          // console.error(`error fetching directions ${result}`);
          setMessage("Invalid origin address, please be more specific")
          setTimeout(() => {
            setMessage(null);
          }, 5000);
          
        }
      }
    );

  }

  return (
  
      <div className="FindStore">
        {isLoading || !isLoaded ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <React.Fragment>
            <h2 className="display-3 text-center"> Find my Store </h2>
            <br></br>
            {message && (
              <React.Fragment>
                <Alert className="text-center" variant="danger">
                  {message}
                </Alert>
                <br></br>
              </React.Fragment>
            )}
            <div className="d-flex justify-content-center">
              <p><i>Enter your address to map to our store.</i></p>
            </div>
            <div className="d-flex justify-content-center">
              <input placeholder="1234 snow dr, tx" onChange={(e) => {setOriginAddress(e.target.value)}}></input>
              <Button onClick={() => calcRoute()}>Find Route!</Button>
            </div>
            <br></br><br></br>
            <div className="d-flex justify-content-center">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                <Marker position={center}/>
                {hasDirections && 
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: '#ff00dd',
                        strokeOpacity: 0.8,
                        strokeWeight: 6,
                      },
                      preserveViewport: true,
                      suppressMarkers: true,
                    }}
                  />
                }
                <></>
              </GoogleMap>
            </div>
            <br></br><br></br>
            <div className="text-center">
                <p>Panda Express, College Station is located at:</p>
                <p>275 Joe Routt Blvd,</p>
                <p>College Station, TX 77840</p>
            </div>
            <br></br><br></br><br></br><br></br>
          </React.Fragment>
      )
    }
    </div>
    );


}

FindStore.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(FindStore);
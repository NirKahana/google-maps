import React, { useState, useEffect, useRef } from "react";
import api_key from '../myEnv';
import { motion } from "framer-motion"
// import {useSpring, animated} from 'react-spring'
// import * as easings from 'd3-ease'
import israeliSettelments from '../cities.json'
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
// require("dotenv").config();
const editedCities = israeliSettelments.map((settlement) => {return {name: settlement.MGLSDE_L_4, population: settlement.MGLSDE_L_1, lat: settlement.Y, lng: settlement.X}})
let citiesList = editedCities.filter((city) => city.population > 10000);
const originalLength = citiesList.length;

function MapGame() {
  
  const defaultCenter = {
    lat: 31.4,
    lng: 34.7
  };
  let turnNumber = originalLength-citiesList.length;
  // const getRandomIndex = (arr) => Math.floor(Math.random()*(arr.length));
  const drawCity = () => {
    if (citiesList.length === 0) {
      setCurrentCity("game over")
      return "game over"
    }
    const randomIndex = Math.floor(Math.random()*(citiesList.length));
    let randomCity = citiesList[randomIndex];
    randomCity.index = randomIndex;
    setCurrentCity(randomCity);
    citiesList.splice(randomIndex, 1);
  }

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter); /// for some reason is necessary
  const [currentCity, setCurrentCity] = useState(null)
  const [points, setPoints] = useState(0);
  const [score, setScore] = useState(null);

  const scoreRef = useRef();

  // const props = useSpring({
  //   config: { 
  //     duration: 500,
  //     // easing: easings.easePolyOut.exponent(1),
  //     easing: easings.easeQuadOut,
  //   },
  //   from: { opacity: 0, fontSize: "1.25em"},
  //   // to: [
  //   //   {opacity: 1, fontSize: "1.5em"}, 
  //   //   {opacity: 0, fontSize: "1.5em"}
  //   // ],
  //   to: async (next, cancel) => {
  //     await next({opacity: 1, fontSize: "1.4em"})
  //     await next({opacity: 0, fontSize: "1.5em"})
  //   },
  // })

  useEffect(() => {
    console.log(citiesList.length);
    drawCity()
  },[])

  useEffect(() => {
    console.log("current city is: ", currentCity);
  },[currentCity])

  const mapStyles = {
    height: "100vh",
    width: "100%",
    display: "inline-block"
  };

  const onClicked = (e) => {
    const position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    setMarkerPosition(position)
    if (currentCity !== "game over") {
      const d = clacDistance(position, currentCity)
      drawCity()
      const score = calcPoints(d)
      setScore(`+${score.toFixed()}`);
      setPoints(points + score);
      // console.log("previous city is: ", currentCity.name);
      // console.log('distance is: ', d);
      // console.log('score is: ', score);
    }
  }


  
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  const clacDistance = (city1, city2) => getDistanceFromLatLonInKm(city1.lat, city1.lng, city2.lat, city2.lng);
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  const calcPoints = (distance) => 100-(100*distance/(75 + distance))

  const getScore = () => {
    setTimeout(()=>{
      setScore(null);
    },1500)
    return <div className="score" ref={scoreRef}>{score}</div>
  }

  return (
    currentCity ? 
    <>
    <div className="flex-container">
      <LoadScript googleMapsApiKey={api_key}>
        <GoogleMap mapContainerStyle={mapStyles} 
                   zoom={7.5}
                   center={mapCenter}
                   onClick={onClicked}
                   mapTypeId={"satellite"}
        >
          {markerPosition && 
            <Marker key={"marker"} 
                    position={markerPosition}  
                    draggable={true}
            />
          }
              <div className="info-box">
                <div>{currentCity.name ? `#${turnNumber} ${currentCity.name}` : "game over"}</div>
                <div>Points: {points.toFixed()}</div>
                {score && 
                <motion.div animate={{ opacity: [0,1,1,0] }} 
                            initial={{opacity: 0}} 
                            transition={{ ease: "easeOut", duration: 1 }} 
                            onAnimationComplete={() => setScore(null)}
                >
                  {score}
                </motion.div>}
                  {/* <animated.h1 style={props}>hello</animated.h1> */}
              </div>
        </GoogleMap>
      </LoadScript>
    </div>
    </>
    :
    <div>Loading...</div>
  );
}

export default MapGame;

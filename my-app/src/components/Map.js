import React, { useState, useEffect, useRef } from "react";
import israeliSettelments from '../cities.json'
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import axios from 'axios'
// require("dotenv").config();
const editedCities = israeliSettelments.map((settlement) => {return {name: settlement.MGLSDE_L_4, population: settlement.MGLSDE_L_1, lat: settlement.Y, lng: settlement.X}})
let citiesList = editedCities.filter((city) => city.population > 200000);

function MapGame() {
  
  const defaultCenter = {
    lat: 31.4,
    lng: 34.7
  };
  // const getRandomIndex = (arr) => Math.floor(Math.random()*(arr.length));
  const drawCity = () => {
    if (citiesList.length === 0) {
      setCurrentCity(null)
      return "game over"
    }
    const randomIndex = Math.floor(Math.random()*(citiesList.length));
    let randomCity = citiesList[randomIndex];
    randomCity.index = randomIndex;
    setCurrentCity(randomCity);
    citiesList.splice(randomIndex, 1);
  }

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [currentCity, setCurrentCity] = useState(null)
  const [points, setPoints] = useState(0);
    
  useEffect(() => {
    console.log(citiesList.length);
    drawCity()
  },[])

  useEffect(() => {
    console.log("current city is: ", currentCity);
  },[currentCity])

  const mapStyles = {
    height: "100vh",
    width: "80%",
  };

  const onClicked = (e) => {
    const position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    setMarkerPosition(position)
    if (currentCity !== null) {
      const d = clacDistance(position, currentCity)
      drawCity()
      const score = calcPoints(d)
      console.log("previous city is: ", currentCity.name);
      console.log('distance is: ', d);
      // console.log('turns played: ', turnsPlayed+1);
      console.log('score is: ', score);
      setPoints(points + score)
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
  const calcPoints = (distance) => 100-(100*distance/(100 + distance))

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyDPYiDA_pLwFMRMF0D0wQi8V75rxAy964Y">
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

        </GoogleMap>
      </LoadScript>
      <span>{points}</span>
    </>
  );
}

export default MapGame;

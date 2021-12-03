import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import "../assets/Home.css";

const Home = () => {
  const defaultProps = {
    center: {
      lat: 47.6062,
      lng: -122.335167
    },
    zoom: 11
  };
  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let res = await fetch('/home/15');
      res = await res.json();
      setItems(res);
      setDataLoaded(true);
    }
    fetchData();
  }, [])
  const renderData = () => {
    if (!dataLoaded)
      return (
        <div><br />
          <h1> Loading... </h1>{" "}
        </div>
      );
    console.log(items);
    return (

      // ADD SEATTLE PERIMETER
      <div style={{ height: '100vh', width: '100%' }}>
        <div>
          <h1>ADD APP INTRO HERE </h1>
        </div>
        <div class="map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCJCoYjXn5NE19djxVGFJhveEaXwqNkmC0" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {items.map(({OFFENSE_CODE, REPORT_NUMBER, LATITUDE, LONGITUDE}) => (
            <Marker
              key={REPORT_NUMBER}
              text={OFFENSE_CODE}
              lat={LATITUDE}
              lng={LONGITUDE}
            />
          ))}
        </GoogleMapReact>
        </div>
        
      </div>
    );
  }
  return renderData();
}

export default Home;

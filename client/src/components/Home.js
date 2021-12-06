import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Spinner from 'react-bootstrap/Spinner';
import Marker from './Marker';
import "../assets/Home.css";

const Home = () => {
  const defaultProps = {
    center: {
      lat: 47.6062,
      lng: -122.335167
    },
    zoom: 13
  };
  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let res = await fetch('/home/30');
      res = await res.json();
      setItems(res);
      setDataLoaded(true);
    }
    fetchData();
  }, [])
  const renderData = () => {
    if (!dataLoaded)
    return (
      <div>
        <br />
          <h1> Loading data... </h1>{" "}
          <br />
         <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>

        
      );
    console.log(items);
    return (
      // ADD SEATTLE PERIMETER
      <div class="mainDiv">
        <br />  
        <div style={{ height: "100vh", width: "100%" }}>
          <h1>MyCrimeCompass - Seattle</h1>
          <h4>A criminal offense database | Offense count 2008-Nov.2021: 936470</h4>
          <div className="map">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyCJCoYjXn5NE19djxVGFJhveEaXwqNkmC0",
              }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              {items.map(
                ({ OFFENSE_CODE, REPORT_NUMBER, LATITUDE, LONGITUDE }) => (
                  <Marker
                    key={REPORT_NUMBER}
                    // text={OFFENSE_CODE}
                    lat={LATITUDE}
                    lng={LONGITUDE}
                  />
                )
              )}
            </GoogleMapReact>
          </div>
        </div>
        </div>
    );
  }
  return renderData();
}

export default Home;

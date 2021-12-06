import React, { useEffect, useState } from "react";
import Highcharts, { numberFormat } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Spinner from "react-bootstrap/Spinner";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import "../assets/Quadrants.css";

const Quadrants = () => {
  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);
  // let [crimesDisplay, setCrimesDisplay] = useState([]);
  let [years, setYears] = useState([]);
  const [year, setYear] = useState(2008);
  const [month, setMonth] = useState("January");

  useEffect(() => {
    async function fetchData() {
      let res = await fetch("/quadrants");
      res = await res.json();
      setItems(res);
      let years = new Set();
      res.forEach((obj) => years.add(obj.Year));
      setYears([...years]);
      setDataLoaded(true);
    }
    fetchData();
  }, []);

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

    const crimesYear = items.filter((obj) => obj.Year === year);
    console.log(crimesYear);

    
    const crimesMonthYear = crimesYear.filter(
      (obj) => obj.Month === month.toUpperCase()
      );
    
    const quadrant = crimesMonthYear.map((obj) => obj["Quadrant"]);
    console.log(quadrant);
  
    const crimeCount = crimesMonthYear.map((obj) => obj["Crime Count"]);
    console.log(crimeCount);

    const crimesWithLocs = crimesMonthYear.map(obj => {
      switch (obj.Quadrant) {
        case "SW":
          obj["lat"] = "47.6062";
          obj["lng"] = "-122.335167";
          break;
        // case "NW":
        //   obj.lat = "47.6062";
        //   obj.lng = "-122.335167";
        //   break;
        // case "SE":
        //   obj.lat = "47.6062";
        //   obj.lng = "-122.335167";
        //   break;
        // case "NE":
        //   obj.lat = "47.6062";
        //   obj.lng = "-122.335167";
        //   break;
      
        // default:
        //   break;
      }
    });

    const markers = crimesWithLocs.map((obj, index) => (
      <Marker
        key={index}
        // lat={obj.lat}
        // lng={obj.lng}
        // text={obj["Crime Count"]}
      />
    ));
    


    // const options = {
    //   chart: {
    //     type: "column",
    //     borderRadius: 10,
    //     width: 900,
    //     height: 500
    //   },
    //   title: {
    //     text: `Number of Crimes During ${month} ${year}`,
    //   },
    //   xAxis: {
    //     categories: quadrant,
    //   },
    //   yAxis: {
    //     title: {
    //       text: "Volume",
    //     },
    //   },
    //   series: [
    //     {
    //       name: `${month} ${year}`,
    //       data: crimeCount,
    //       colorByPoint: true,
    //     },
    //   ],
    //   plotOptions: {
    //     line: {
    //       dataLabels: {
    //         enabled: true,
    //       },
    //     },
    //   },
    // };

    const options2 = {
      chart: {
        type: "line",
        borderRadius: 10,
        width: 900,
        height: 500
      },
      title: {
        text: `Number of Crimes Per City Quadrant During ${month} ${year}`,
      },
      xAxis: {
        categories: quadrant,
      },
      yAxis: {
        title: {
          text: "Volume",
        },
      },
      series: [
        {
          name: `${month} ${year}`,
          data: crimeCount,
          colorByPoint: true,
        },
      ],
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
        },
      },
    };

    const mapProps = {
      center: {
        lat: 47.6062,
        lng: -122.335167
      },
      zoom: 11
    };

    return (
      // HEATMAP - MONTHS ON Y-AXIS, TIMEOFDAY (ASC) ON X-AXIS
      // YEAR RANGE AS USER FILTER

      <div class="mainDiv" style={{ margin: "50px" }}>
        <div class="filters">
          <form>
            <label>Month:</label>
            <select
              class="form-select"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>

            <label>Year:</label>
            <select
              class="form-select"
              value={year}
              onChange={(event) => setYear(parseInt(event.target.value))}
            >
              {years.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </form>
        </div>
        
        <br />
        <br />

        {/* <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCJCoYjXn5NE19djxVGFJhveEaXwqNkmC0" }}
          defaultCenter={mapProps.center}
          defaultZoom={mapProps.zoom}>
            {markers}
        </GoogleMapReact>

        </div> */}

        <div class="charts">
          <HighchartsReact highcharts={Highcharts} options={options2} />
          {/* <br />
          <br />
          <br />
          <HighchartsReact highcharts={Highcharts} options={options2} /> */}
        </div>

      </div>
    );
  };
  return renderData();
};

export default Quadrants;

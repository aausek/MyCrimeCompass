import React, { useEffect, useState } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const TimeOfDay = () => {

  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    
    async function fetchData() {
      let res = await fetch('/time-of-day');
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
          <h1> Loading... </h1>{" "}
        </div>
      );
      
      console.log(items);
      let newData = []
      for (let i = 0; i < items.length; i++) {
        newData.push({
          name: items[i]["Year"],
          data: items[i]["Time Frame"]
        });
    }
      const options = {
        title: {
          text: "Time Of Day",
        },
        xAxis: {
          categories: [items[0]["Year"]],
        },
        yAxis: {
          title: {
            text: "Number of Crimes",
          },
        },
        series: [
          {
            data : [items[0]["Number of Crimes"]],
          },
        ],
      };

    // console.log(newData);

    // options.series[0].data = newData;
    // options.xAxis[0].name;
    console.log(newData);

    // this.setState({ data: newData });

    return (
      
      // HEATMAP - MONTHS ON Y-AXIS, TIMEOFDAY (ASC) ON X-AXIS
      // NUMBER OF CRIMES AS COLOR AXIS
      // YEAR RANGE AS USER FILTER
      
      <div style={{margin: "50px"}}>
          {/* {this.state &&
          this.state.items && ( */}
        <HighchartsReact highcharts={Highcharts} options={options}/> 
        {/* )} */}
      </div>  
    );
  }
  return renderData();
}

export default TimeOfDay;

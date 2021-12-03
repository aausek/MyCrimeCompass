import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AverageDuration = () => {

  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);
  let [years, setYears] = useState([]);
  const [year, setYear] = useState(2008);
  const [month, setMonth] = useState("January");

  useEffect(() => {
    async function fetchData() {
      let res = await fetch("/average-duration");
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
        <div><br />
          <h1> Loading... </h1>{" "}
        </div>
      );
    
    const crimesYear = items.filter((obj) => obj.Year === year);
    console.log(crimesYear);

    const crimesMonthYear = crimesYear.filter(
      (obj) => obj.Month === month.toUpperCase()
    );
    console.log(crimesMonthYear);

    const offense = crimesMonthYear.map((obj) => obj["Offense"]);
    console.log(offense);

    const days = crimesMonthYear.map((obj) => obj["Average Length (Days)"]);
    console.log(days);

    const options = {
      chart: {
        type: "column",
      },
      title: {
        text: `Average Duration of Crimes During ${month} ${year}`,
      },
      xAxis: {
        categories: offense,
      },
      yAxis: {
        title: {
          text: "Volume",
        },
      },
      series: [
        {
          name: `${month} ${year}`,
          data: days,
        },
      ],
      tooltip: {
        enabled: true,
        formatter: function(){
            return Math.round(parseInt(this.y));
        }
    }    
    };

    const options2 = {
      chart: {
        type: "line",
      },
      title: {
        text: `Average Duration of Crimes During ${month} ${year}`,
      },
      xAxis: {
        categories: offense,
      },
      yAxis: {
        title: {
          text: "Volume",
        },
      },
      series: [
        {
          name: `${month} ${year}`,
          data: days,
        },
      ],
      tooltip: {
        enabled: true,
        formatter: function(){
            return Math.round(parseInt(this.y));
        }
      }    
    };

    const options3 = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: `Average Duration of Crimes During ${month} ${year}`,
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: `${month} ${year}`,
          data: days
        },
      ],
    };

    return (
      // HEATMAP - MONTHS ON Y-AXIS, TIMEOFDAY (ASC) ON X-AXIS
      // NUMBER OF CRIMES AS COLOR AXIS
      // YEAR RANGE AS USER FILTER

      <div style={{ margin: "50px" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <br /><br /><br />
        <HighchartsReact highcharts={Highcharts} options={options2} />
        <br /><br /><br />
        <HighchartsReact highcharts={Highcharts} options={options3} />
        <form>
          <label>Year</label>
          <select
            value={year}
            onChange={(event) => setYear(parseInt(event.target.value))}
          >
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
          <label>Month</label>
          <select
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
        </form>
      </div>
    );
  };
  return renderData();
};

export default AverageDuration;

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TimeOfDay = () => {
  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);
  // let [crimesDisplay, setCrimesDisplay] = useState([]);
  let [years, setYears] = useState([]);
  const [year, setYear] = useState(2008);
  const [month, setMonth] = useState("January");

  useEffect(() => {
    async function fetchData() {
      let res = await fetch("/time-of-day");
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
          <h1> Loading... </h1>{" "}
        </div>
      );

    // console.log(year);
    // console.log(month);
    // console.log(items);
    const crimesYear = items.filter((obj) => obj.Year === year);
    console.log(crimesYear);

    const crimesMonthYear = crimesYear.filter(
      (obj) => obj.Month === month.toUpperCase()
    );
    console.log(crimesMonthYear);

    const times = crimesMonthYear.map((obj) => obj["Time Frame"]);
    console.log(times);

    const numCrimes = crimesMonthYear.map((obj) => obj["Number of Crimes"]);
    console.log(numCrimes);

    const options = {
      chart: {
        type: "column",
      },
      title: {
        text: `Number of Crimes During ${month} ${year}`,
      },
      xAxis: {
        categories: times,
      },
      yAxis: {
        title: {
          text: "Volume",
        },
      },
      series: [
        {
          name: `${month} ${year}`,
          data: numCrimes,
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

    const options2 = {
      chart: {
        type: "line",
      },
      title: {
        text: `Number of Crimes During ${month} ${year}`,
      },
      xAxis: {
        categories: times,
      },
      yAxis: {
        title: {
          text: "Volume",
        },
      },
      series: [
        {
          name: `${month} ${year}`,
          data: numCrimes,
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

    return (
      // HEATMAP - MONTHS ON Y-AXIS, TIMEOFDAY (ASC) ON X-AXIS
      // NUMBER OF CRIMES AS COLOR AXIS
      // YEAR RANGE AS USER FILTER

      <div style={{ margin: "50px" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <br /><br /><br />
        <HighchartsReact highcharts={Highcharts} options={options2} />
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

export default TimeOfDay;

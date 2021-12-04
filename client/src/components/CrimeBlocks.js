import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import networkGraph from "highcharts/modules/networkgraph";
import "../assets/CrimeBlocks.css";

networkGraph(Highcharts);

const CrimeBlocks = () => {
  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);
  // let [crimesDisplay, setCrimesDisplay] = useState([]);
  let [years, setYears] = useState([]);
  const [year, setYear] = useState(2008);
  const [month, setMonth] = useState("January");

  useEffect(() => {
    async function fetchData() {
      let res = await fetch("/crime-blocks");
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

    const blocks = crimesMonthYear.map((obj) => obj["100 Block Address"]);
    console.log(blocks);

    const crimeCount = crimesMonthYear.map((obj) => obj["Crime Count"]);
    console.log(crimeCount);

    const options = {
      chart: {
        type: "column",
        borderRadius: 10,
        width: 900,
        height: 500
      },
      title: {
        text: `Top 5 Blocks Per Crime Count on ${month} ${year}`,
      },
      xAxis: {
        categories: blocks,
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

    const options2 = {
      chart: {
        type: "line",
        borderRadius: 10,
        width: 900,
        height: 500
      },
      title: {
        text: `Number of Crimes During ${month} ${year}`,
      },
      xAxis: {
        categories: blocks,
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

      <div class="mainDiv" style={{ margin: "25px" }}>
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

        <div class="charts">
          <HighchartsReact highcharts={Highcharts} options={options} />
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

export default CrimeBlocks;

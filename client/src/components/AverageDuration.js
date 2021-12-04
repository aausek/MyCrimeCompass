import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import itemChart from "highcharts/modules/item-series";
import "../assets/AverageDuration.css";

itemChart(Highcharts);

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
      console.log(res);
      setItems(res);
      let years = new Set();
      Object.entries(res).forEach((obj) => years.add(obj.Year));
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

    // console.log(items);
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
        borderRadius: 10,
        width: 900,
        height: 500,
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
          // name: `${month} ${year}`,
          showInLegend: false, 
          data: days,
          colorByPoint: true,
        },
      ],
      tooltip: {
        enabled: true,
        formatter: function () {
          return Math.round(parseInt(this.y));
        },
      },
    };

    const options2 = {
      chart: {
        type: "line",
        borderRadius: 10,
        width: 900,
        height: 500,
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
        formatter: function () {
          return Math.round(parseInt(this.y));
        },
      },
    };

    const options3 = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        borderRadius: 10,
        width: 900,
        height: 500,
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
          data: days,
        },
      ],
    };

    const options4 = {
      chart: {
        type: "item",
        borderRadius: 10,
        width: 900,
        height: 500,
      },

      title: {
        text: `Average Duration of Crimes During ${month} ${year}`,
      },
      legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>',
      },
      series: [
        {
          name: `${month} ${year}`,
          data: days,
          dataLabels: {
            enabled: true,
            format: "{point.label}",
          },
        },
      ],
    };

    return (
      // TODO: FILTER TO RANK BY X NUMBER
      // TOP CHART FOR DURATION
      // BOTTOM CHART FOR COUNT

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
        <div class="charts">
          <HighchartsReact highcharts={Highcharts} options={options} />
          <br />
          <br />
          <br />
          {/* <HighchartsReact highcharts={Highcharts} options={options2} />
          <br />
          <br />
          <br /> */}
          {/* <HighchartsReact highcharts={Highcharts} options={options3} />
          <br />
          <br />
          <br /> */}
          <HighchartsReact highcharts={Highcharts} options={options4} />
        </div>
      </div>
    );
  };
  return renderData();
};

export default AverageDuration;

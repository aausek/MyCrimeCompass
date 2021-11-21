import React, { useEffect, useState } from "react";

const AverageDuration = () => {

  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let res = await fetch('/crime-by-average-duration');
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
    return (
      <h1>AverageDuration Component</h1>
    );
  }
  return renderData();
}

export default AverageDuration;

import React, { useEffect, useState } from "react";

const Precinct = () => {

  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let res = await fetch('/precinct');
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
      <h1>Precinct Component</h1>
    );
  }
  return renderData();
}

export default Precinct;

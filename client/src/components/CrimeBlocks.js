import React, { useEffect, useState } from "react";

const CrimeBlocks = () => {

  let [items, setItems] = useState([]);
  let [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let res = await fetch('/crime-blocks');
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
      <h1>CrimeBlocks Component</h1>
    );
  }
  return renderData();
}

export default CrimeBlocks;

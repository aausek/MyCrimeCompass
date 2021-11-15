import React, { Component } from "react";

class Home extends Component {
  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      DataisLoaded: false,
    };
  }

  // ComponentDidMount is used to
  // execute the code
  componentDidMount() {
    fetch("/home")
      .then((res) => res.json())
      // .then(data => console.log(data));
      .then((json) => {
        this.setState({
          items: json,
          DataisLoaded: true,
        });
      });
  }
  render() {
    const { DataisLoaded, items } = this.state;
    if (!DataisLoaded)
      return (
        <div>
          <h1> Loading... </h1>{" "}
        </div>
      );

    return (
      <div className="App">
       {JSON.stringify(items, null, '\t')}
      </div>
    );
  }
}

export default Home;

import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import Home from "./components/Home/Home";
import AverageDuration from "./components/AverageDuration/AverageDuration";
import Precinct from "./components/Precinct/Precinct";
 
class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>Simple SPA</h1>
          <ul className="header">
            <li><a href="/home">Home</a></li>
            <li><NavLink to="/crime-by-time-of-day">Crime By Time of Day</NavLink></li>
            <li><NavLink to="/crime-by-average-duration">Crime By Average Duration</NavLink></li>
            <li><NavLink to="/crime-by-precinct-highest-lowest">Highest and Lowest Incidence of Crime By Precinct</NavLink></li>
          </ul>
          <div className="content">
            <Route path="/crime-by-time-of-day" component={Home}/>
            <Route path="/crime-by-average-duration" component={AverageDuration}/>
            <Route path="/crime-by-precinct-highest-lowest" component={Precinct}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default App;
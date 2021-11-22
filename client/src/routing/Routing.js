import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeView from "../views/HomeView";
import AverageDurationView from "../views/AverageDurationView";
import PrecinctView from "../views/PrecinctView";
import TimeOfDayView from "../views/TimeOfDayView";
import QuadrantsView from "../views/QuadrantsView";
import CrimeBlocksView from "../views/CrimeBlocksView";


// Add remaining routes
const Routing = () => (
  <Routes>
    <Route path="/" element={<HomeView />} />
    <Route path="/home" element={<HomeView />} />
    <Route path="/time-of-day" element={<TimeOfDayView />} />
    <Route path="/average-duration" element={<AverageDurationView />} />
    <Route path="/precinct" element={<PrecinctView />} />
    <Route path="/quadrants" element={< QuadrantsView/>} />
    <Route path="/crime-blocks" element={< CrimeBlocksView />} />
  </Routes>
);

export default Routing;

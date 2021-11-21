import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../views/HomeView";
import AverageDuration from "../views/AverageDurationView";
import Precinct from "../views/PrecinctView";
import TimeOfDay from "../views/TimeOfDayView";


// Add remaining routes
const Routing = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/crime-by-time-of-day" element={<TimeOfDay />} />
    <Route path="/crime-by-average-duration" element={<AverageDuration />} />
    <Route path="/crime-by-precinct-highest-lowest" element={<Precinct />} />
  </Routes>
);

export default Routing;

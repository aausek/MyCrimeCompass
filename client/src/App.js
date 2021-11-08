import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, BrowserRouter as Router } from "react-router-dom";
import Routing from "./routing/Routing";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <Router>
            <Navbar bg="dark" variant="dark">
              <Container>
                <Navbar.Brand href="/home">MyCrimeCompass</Navbar.Brand>

                <Nav className="justify-content-end">
                  <Nav.Item>
                    <Nav.Link as={Link} to="/home">
                      Home
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link as={Link} to="/crime-by-time-of-day">Time of Day</Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link as={Link} to="/crime-by-average-duration">
                      Average Duration
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link as={Link} to="/crime-by-precinct-highest-lowest">
                      Crime By Precinct
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Container>
            </Navbar>

            <Routing />
          </Router>
        </div>
      </div>
    );
  }
}

export default App;

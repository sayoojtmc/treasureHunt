import React, { Component } from "react";
import { Nav, Button, Navbar, Jumbotron } from "react-bootstrap";
import fire from "../config/fire";
class Home extends Component {
  logout() {
    fire.auth().signOut();
  }
  render() {
    return (
      <div>
        <Navbar bg="dark">
          <Navbar.Brand href="#home"></Navbar.Brand>
          <Navbar.Brand className="ml-auto">
            <Button variant="warning" onClick={this.logout}>
              logout
            </Button>
          </Navbar.Brand>
        </Navbar>
        <div
          style={{
            height: "50vh",
            alignItems: "center",
          }}
        >
          <Jumbotron className="my-5 mx-5">
            <div>
              <h1>Insert Image here</h1>
            </div>
          </Jumbotron>
        </div>
      </div>
    );
  }
}
export default Home;

import React, {Component} from 'react';
import { Navbar, Jumbotron } from "react-bootstrap";
import withAuthorization from '../Session/withAuthorization';

class Home extends Component {
    render() {
      return (
        <div>
          <Navbar bg="dark">
            <Navbar.Brand href="#home"></Navbar.Brand>
            
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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
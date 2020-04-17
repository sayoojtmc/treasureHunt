import React, { Component } from "react";
import { Navbar, Jumbotron } from "react-bootstrap";
import withAuthorization from "../Session/withAuthorization";
import Firebase from "../Firebase/Firebase";
import { Accordion, Card } from "react-bootstrap";
class Home extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    return (
      <div>
        <div
          style={{
            height: "50vh",
            alignItems: "center",
          }}
        >
          <div className="row">
            <div className="col-md-6 offset-sm-3">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle
                    as={Card.Header}
                    variant="link"
                    eventKey="0"
                  >
                    How to play
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>Rules</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <div></div>
              </Accordion>
              <Jumbotron className="my-5 mx-5">
                <div>
                  <img src="testimage.jpeg" className="img img-fluid" />
                </div>
              </Jumbotron>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Home);

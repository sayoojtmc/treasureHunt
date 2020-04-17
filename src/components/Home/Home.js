import React, { Component } from "react";
import { Navbar, Jumbotron } from "react-bootstrap";
import withAuthorization from "../Session/withAuthorization";
import Firebase from "../Firebase/Firebase";
import { withFirebase } from "../Firebase/context";
import { Accordion, Card } from "react-bootstrap";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 1,
      guesses: 4,
      url: "",
    };
  }
  componentDidMount() {
    console.log(this.props);
    const db = this.props.firebase.firestore
      .doc(`users/${this.props.uid}`)
      .get()
      .then((snapshot) => {
        try {
          var level = snapshot.data()["level"];
          var guess = snapshot.data()["guesses"];
          console.log(level, guess);
          this.setState({ level: level, guesses: guess });
        } catch (e) {}
      });
    var storage = this.props.firebase.storage;
    var pathReference = storage.ref(`images/${this.state.level}.jpg`);
    pathReference.getDownloadURL().then((url) => {
      try {
        this.setState({ url: url });
      } catch (e) {}
    });
  }
  geturl() {
    var storage = this.props.firebase.storage;
    var pathReference = storage.ref(`images/${this.state.level}.jpg`);
    pathReference.getDownloadURL().then((url) => {
      console.log(url);
      return url;
    });
  }
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
                  <img src={this.state.url} className="img img-fluid" />
                </div>
                {JSON.stringify(this.state)}
              </Jumbotron>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(withFirebase(Home));

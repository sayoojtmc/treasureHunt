import React, { Component } from "react";
import { Navbar, Jumbotron } from "react-bootstrap";
import withAuthorization from "../Session/withAuthorization";
import Firebase from "../Firebase/Firebase";
import withFireBase from "../Firebase/context";
class Home extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const db = this.props.firebase.firestore;
    var user = this.props.auth.CurrentUser;
    db.collection("user");
    console.log(user);
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

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(withFireBase(Home));

import React, { Component } from "react";
import { withFirebase } from "./Firebase/context";
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
    };
  }
  componentDidMount() {
    const users = {};
    this.props.firebase.firestore.collection(`users`).onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        users[doc.id] = doc.data();
      });
      console.log(users);

      this.setState({ users: users });
    });
  }
  render() {
    return (
      <>
        <ul>
          {Object.keys(this.state.users).map((user) => {
            return <li>{JSON.stringify(this.state.users[user])}</li>;
          })}
        </ul>
      </>
    );
  }
}
export default withFirebase(Admin);

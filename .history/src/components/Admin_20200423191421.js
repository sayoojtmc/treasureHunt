import React, { Component } from "react";
import { withFirebase } from "./Firebase/context";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      tasks: {},
      urls: {},
      loading: false,
      pass: false,
    };
  }

  handleVerify = (uid, level) => (event) => {
    event.preventDefault();
    const userRef = this.props.firebase.firestore.doc(`users/${uid}`);
    userRef
      .set(
        { isVerified: true, isSubmitted: false, level: level + 1 },
        { merge: true }
      )
      .then((snapshot) => {
        console.log("updated");
      });
  };
  handleReject = (uid) => (event) => {
    event.preventDefault();
    const userRef = this.props.firebase.firestore.doc(`users/${uid}`);
    userRef
      .set({ isRejected: true, isSubmitted: false }, { merge: true })
      .then((snapshot) => {
        console.log("updated");
      });
  };
  componentDidMount() {
    const users = {};
    const tasks = {};
    const urls = {};

    const currid = this.props.uid;
    console.log(currid);
    this.props.firebase.firestore
      .doc(`users/${currid}`)
      .get()
      .then((userDoc) => {
        console.log(userDoc);
        try {
          var role = userDoc.data()["role"];
          this.setState({ role: role });
        } catch (e) {}
      });

    this.props.firebase.firestore
      .collection(`users`)
      .where("isSubmitted", "==", true)
      .limit(10)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          users[doc.id] = doc.data();
          var level = doc.data()["level"];
          var uid = doc.id;
          var storage = this.props.firebase.storage;
          var pathReference = storage.ref(`tasks/${doc.id}/${level}`);
          pathReference
            .getDownloadURL()
            .then((url) => {
              try {
                var urls = { ...this.state.urls };
                this.setState({ loading: true });
                urls[uid] = url;
                this.setState({ urls, loading: true });
                this.forceUpdate();
              } catch (e) {
                console.log(e);
              }
            })
            .catch((e) => console.log(e));
        });
        console.log(users);

        this.setState({ users: users, urls: urls });
      });
  }
  render() {
    return (
      <>
        {this.state.role ? (
          <ul>
            {Object.keys(this.state.users).map((user) => {
              var { username, level, email } = this.state.users[user];
              var uid = user;
              if (typeof this.state.loading != "undefined")
                var link = this.state.urls[user];

              return (
                <li key="urls">
                  id:{uid} user: {username} email: {email} level: {level} link:
                  <a
                    key="urls"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={this.state.urls[uid]}
                  >
                    Download task
                  </a>
                  <button
                    className="btn btn-success"
                    onClick={this.handleVerify(uid, level)}
                  >
                    verify
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={this.handleReject(uid)}
                  >
                    reject
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          "not admin"
        )}
      </>
    );
  }
}
export default withFirebase(Admin);

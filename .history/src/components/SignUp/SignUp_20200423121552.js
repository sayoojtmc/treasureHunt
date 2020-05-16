import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";

import * as ROUTES from "../../constants/routes";

const SignUpPage = () => (
  <div className="text-center py-3">
    <h1 className="py-3">Create account to play</h1>

    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  branch: "",
  error: null,
};
const generateUserDocument = async (user, additionalData, firestore) => {
  if (!user) return;
  console.log(user.uid);
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email } = user;
    try {
      await userRef.set({
        email: email,

        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  // return getUserDocument(user.uid, firestore);
};
export const getUserDocument = async (uid, firestore) => {
  if (!uid) return null;

  const userDocument = await firestore.doc(`users/${uid}`).get();
  try {
    return await {
      uid,
      role: userDocument.data().role,
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { username, email, passwordOne, branch } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
        var user = this.props.firebase.auth.currentUser;
        generateUserDocument(
          user,
          {
            level: 1,
            guesses: 4,
            username: username,
            email: email,
            branch: branch,
            role: 0,
            isSubmitted: false,
            isVerified: false,
            isRejected: false,
            isWin: false,
          },

          this.props.firebase.firestore
        ).then((userDoc) => {
          console.log(userDoc);
        });
      })

      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, email, passwordOne, branch, error } = this.state;

    const isInvalid = passwordOne === "" || email === "" || username === "";

    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                name="username"
                className="form-control"
                value={username}
                onChange={this.onChange}
                type="text"
                placeholder="Full Name"
              />
            </div>
            <div className="form-group">
              <input
                name="email"
                className="form-control"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="branch"
                value={branch}
                onChange={this.onChange}
                type="text"
                placeholder="Branch"
              />
            </div>
            <button className="btn btn-info" disabled={isInvalid} type="submit">
              Sign Up
            </button>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm };

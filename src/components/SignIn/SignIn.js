import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { getUserDocument } from "../SignUp/SignUp";
const SignInPage = () => (
  <div className="text-center py-3">
    <h1 className="py-3">Login to continue</h1>
    <SignInForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;
    event.preventDefault();
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });

        this.props.history.push(ROUTES.HOME);
        var uid = this.props.firebase.auth.currentUser.uid;
        var firestore = this.props.firebase.firestore;
        getUserDocument(uid, firestore).then((userDoc) => {
          try {
            if (typeof window != "undefined") {
              localStorage.setItem("auth", JSON.stringify(userDoc));
            }
            console.log(userDoc);
          } catch (e) {}
        });
      })

      .catch((error) => {
        this.setState({ error });
      });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
            </div>
            <button className="btn btn-info" disabled={isInvalid} type="submit">
              Sign In
            </button>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));
export default SignInPage;

export { SignInForm };

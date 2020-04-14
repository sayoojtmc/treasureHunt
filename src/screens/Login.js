import React, { Component } from "react";
import fire from "../config/fire";

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: "",
      password: "",
    };
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  login(e) {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        console.log(u);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.email}
          placeholder="email"
          name="email"
          onChange={this.handleChange}
        />
        <input
          type="password"
          value={this.state.password}
          placeholder="password"
          name="password"
          onChange={this.handleChange}
        />

        <button onClick={this.login}>Login</button>
        <button onClick={this.signup}>SignUp</button>
      </div>
    );
  }
}
export default Login;

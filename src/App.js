import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./screens/Home";
import Login from "./screens/Login";
import fire from "./config/fire";
class App extends Component {
  state = {
    user: {},
  };
  componentDidMount() {
    this.authListener();
  }
  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }
  render() {
    return <div>{this.state.user ? <Home /> : <Login />}</div>;
  }
}

export default App;

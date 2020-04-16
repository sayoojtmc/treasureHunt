import React from "react";
import { Link, withRouter } from "react-router-dom";
import SignOutButton from "../SignOut/SignOut";
import * as ROUTES from "../../constants/routes";
import { Navbar } from "react-bootstrap";

const isSelected = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "blue" };
  } else {
    return { color: "#FFFFFF" };
  }
};

const Navigation = (props) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <ul className="navbar-nav">
      {props.authUser ? <NavigationAuth /> : <NavigationNonAuth />}
    </ul>
  </nav>
);

const NavigationAuth = () => (
  <li className="nav-item">
    <SignOutButton />
  </li>
);

const NavigationNonAuth = () => (
  <>
    <li className="nav-item px-3">
      <Link to={ROUTES.SIGN_UP} style={{ color: "white" }}>
        Sign Up
      </Link>
    </li>
    <li className="nav-item">
      <Link to={ROUTES.SIGN_IN} style={{ color: "white" }}>
        Sign In
      </Link>
    </li>
  </>
);

export default Navigation;

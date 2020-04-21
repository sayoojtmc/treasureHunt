import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { Button } from "react-bootstrap";
import { withFirebase } from "../Firebase";



const SignOut = ({ firebase }) => (
    <Button variant="warning" onClick={firebase.doSignOut}>
      Sign Out
    </Button>
);

const SignOutButton = withFirebase(SignOut);

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
        <Button variant="warning">
            <Link to={ROUTES.SIGN_UP} style={{ color: "black" }}>
                Sign Up
            </Link>
        </Button>
    </li>
    <li className="nav-item">
        <Button variant="warning">
            <Link to={ROUTES.SIGN_IN} style={{ color: "black" }}>
                Sign In
            </Link>
        </Button>
    </li>
  </>
);

export default Navigation;

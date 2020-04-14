import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../SignOut/SignOut";
import * as ROUTES from "../../constants/routes";
import { Navbar } from "react-bootstrap";
const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
  <Navbar.Brand className="ml-100">
    <SignOutButton />
  </Navbar.Brand>
);

const NavigationNonAuth = () => (
  <>
    <Navbar.Brand className="ml-auto">
      <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </Navbar.Brand>
    <Navbar.Brand className="ml-auto">
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </Navbar.Brand>
  </>
);

export default Navigation;

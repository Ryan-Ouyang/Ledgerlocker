import React from "react";
import "bulma/css/bulma.css";
import profileImage from "../../assets/johndoe.png";
import { Link } from "react-router-dom";
export default function Navbar(props) {
  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <a className="navbar-item" href="https://bulma.io">
        <img
          src="https://bulma.io/images/bulma-logo.png"
          width="112"
          height="28"
        ></img>
      </a>
      <Link className="navbar-item" to="/">
        Home
      </Link>
      <Link className="navbar-item" to="/search">
        Search
      </Link>
      <div className="navbar-end">
        <div className="navbar-item">
          <p>{props.addr}</p>
        </div>
        <Link className="navbar-item" to="/profile">
          <img src={profileImage} className="profile-img" />
        </Link>
      </div>
    </nav>
  );
}

import React from "react";
import "bulma/css/bulma.css";
import profileImage from "../../assets/johndoe.png";
import Icon from "../../assets/Header.png";
import { Link } from "react-router-dom";
export default function Navbar(props) {
  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <a className="navbar-item" href="/">
        <img
          src={Icon}
          width="112"
          height="28"
        ></img>
      </a>
      <Link className="navbar-item" to="/">
        Home
      </Link>
      <Link className="navbar-item" to="/bookings">
        My Bookings
      </Link>
      <Link className="navbar-item" to="/owner">
        My Listings
      </Link>
      <div className="navbar-end">
        <div className="navbar-item">
          <p>{props.addr ? "Welcome, " + props.addr : ""}</p>
        </div>
        <div className="navbar-item">
          <img src={profileImage} className="profile-img" />
        </div>
      </div>
    </nav>
  );
}

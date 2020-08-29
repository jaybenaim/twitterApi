import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

const NavBar = () => {
  return (
    <React.Fragment>
      <div className={styles.skipLink}>
        <a href="#mainContent">Skip to Main Content</a>
      </div>
      <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between">
        <Link className="navbar-brand" to="/">
          react_starter_template
        </Link>
        <div className="navbar-nav">
          <Link className="nav-item nav-link active" to="/">
            Home
          </Link>
        </div>
      </nav>
    </React.Fragment>
  );
};
export default NavBar;

import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/">Smart Vision</Link>
      <div className="navbar-nav">
        <NavLink className="nav-link" to="/vision">Vision System</NavLink>
        <NavLink className="nav-link" to="/history">History</NavLink>
        <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
      </div>
    </div>
  </nav>
);

export default Navbar;

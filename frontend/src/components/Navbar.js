import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-info' : 'text-white-50'}`;

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/">Smart Vision System</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#smartVisionNav">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="smartVisionNav">
        <div className="navbar-nav ms-auto gap-lg-2">
          <NavLink className={navLinkClass} to="/">Home</NavLink>
          <NavLink className={navLinkClass} to="/vision">Vision System</NavLink>
          <NavLink className={navLinkClass} to="/history">History</NavLink>
          <NavLink className={navLinkClass} to="/dashboard">Dashboard</NavLink>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;

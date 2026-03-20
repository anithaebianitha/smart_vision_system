import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  'Voice commands with Web Speech API',
  'YOLOv8 object detection through FastAPI',
  'Audio guidance and simulated navigation',
  'Detection history with MongoDB storage',
  'Admin dashboard with analytics and history review'
];

const Home = () => (
  <div className="hero-card rounded-4 p-4 p-lg-5">
    <div className="row align-items-center g-4">
      <div className="col-lg-7">
        <p className="page-section-title mb-2">Final Year Project</p>
        <h1 className="display-5 fw-bold mb-3">Voice-Controlled Real-Time Smart Vision System</h1>
        <p className="lead text-muted">
          An accessibility-focused smart assistance platform for object detection, audio guidance, navigation hints,
          and historical monitoring through a modern React dashboard.
        </p>
        <div className="d-flex gap-3 flex-wrap mt-4">
          <Link to="/vision" className="btn gradient-btn text-white px-4 py-2">Open Vision System</Link>
          <Link to="/dashboard" className="btn btn-outline-dark px-4 py-2">View Dashboard</Link>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="glass-card rounded-4 p-4 h-100">
          <h5 className="fw-bold mb-3">Core capabilities</h5>
          <ul className="list-group list-group-flush">
            {features.map((feature) => (
              <li key={feature} className="list-group-item px-0 bg-transparent">{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Home;

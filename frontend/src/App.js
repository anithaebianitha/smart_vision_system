import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VisionSystem from './pages/VisionSystem';
import History from './pages/History';
import Dashboard from './pages/Dashboard';

const App = () => (
  <div className="app-shell">
    <Navbar />
    <main className="container py-4 py-lg-5">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vision" element={<VisionSystem />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={(
            <div className="hero-card rounded-4 p-5 text-center">
              <h2 className="fw-bold mb-3">Page not found</h2>
              <p className="text-muted">The requested route does not exist in the Smart Vision dashboard.</p>
              <Link to="/" className="btn gradient-btn text-white px-4">Go Home</Link>
            </div>
          )}
        />
      </Routes>
    </main>
  </div>
);

export default App;

import React from 'react';
import { cameraFeedUrl } from '../services/api';

const CameraFeed = ({ running, lastError }) => (
  <div className="glass-card rounded-4 p-3 p-lg-4 h-100">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p className="page-section-title mb-1">Live Stream</p>
        <h4 className="mb-0">Webcam feed</h4>
      </div>
      <span className={`badge ${running ? 'text-bg-success' : 'text-bg-secondary'}`}>
        {running ? 'Running' : 'Stopped'}
      </span>
    </div>

    <div className="camera-frame">
      {running ? (
        <img src={cameraFeedUrl} alt="Live smart vision stream" className="feed-image" />
      ) : (
        <div className="camera-placeholder">
          <div>
            <h5 className="fw-bold">Camera preview is not active</h5>
            <p className="mb-0">Start the camera to view the live feed and enable object detection.</p>
          </div>
        </div>
      )}
    </div>

    {lastError && <div className="alert alert-warning mt-3 mb-0">{lastError}</div>}
  </div>
);

export default CameraFeed;

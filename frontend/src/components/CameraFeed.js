import React from 'react';
import { cameraFeedUrl } from '../services/api';

const CameraFeed = ({ running }) => (
  <div className="card shadow-sm">
    <div className="card-header">Live Camera Feed</div>
    <div className="card-body text-center">
      {running ? (
        <img src={cameraFeedUrl} alt="Live stream" className="img-fluid rounded" />
      ) : (
        <p className="text-muted mb-0">Camera is currently stopped.</p>
      )}
    </div>
  </div>
);

export default CameraFeed;

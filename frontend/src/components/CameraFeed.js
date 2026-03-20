import React, { useEffect, useRef, useState } from 'react';
import { cameraFeedUrl } from '../services/api';

const CameraFeed = ({ running, lastError }) => {
  const videoRef = useRef(null);
  const [browserStreamActive, setBrowserStreamActive] = useState(false);
  const [browserError, setBrowserError] = useState('');

  useEffect(() => {
    let localStream;

    const startBrowserCamera = async () => {
      if (!running || !navigator.mediaDevices?.getUserMedia) {
        return;
      }

      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
        setBrowserStreamActive(true);
        setBrowserError('');
      } catch (error) {
        setBrowserStreamActive(false);
        setBrowserError('Browser camera access was blocked. Allow camera permission in the browser.');
      }
    };

    startBrowserCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setBrowserStreamActive(false);
    };
  }, [running]);

  return (
    <div className="glass-card rounded-4 p-3 p-lg-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="page-section-title mb-1">Live Stream</p>
          <h4 className="mb-0">Laptop camera access</h4>
        </div>
        <span className={`badge ${running ? 'text-bg-success' : 'text-bg-secondary'}`}>
          {running ? 'Running' : 'Stopped'}
        </span>
      </div>

      <div className="camera-frame">
        {running ? (
          browserStreamActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="feed-image" />
          ) : (
            <img src={cameraFeedUrl} alt="Live smart vision stream" className="feed-image" />
          )
        ) : (
          <div className="camera-placeholder">
            <div>
              <h5 className="fw-bold">Camera preview is not active</h5>
              <p className="mb-0">Start the camera to access the laptop webcam and enable detection.</p>
            </div>
          </div>
        )}
      </div>

      {browserStreamActive && <div className="alert alert-success mt-3 mb-0">Browser camera preview is active.</div>}
      {browserError && <div className="alert alert-warning mt-3 mb-0">{browserError}</div>}
      {lastError && <div className="alert alert-warning mt-3 mb-0">{lastError}</div>}
    </div>
  );
};

export default CameraFeed;

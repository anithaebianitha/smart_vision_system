import React, { useCallback, useEffect, useState } from 'react';
import CameraFeed from '../components/CameraFeed';
import VoiceControl from '../components/VoiceControl';
import ObjectList from '../components/ObjectList';
import { detectObjects, getDetections, getStatus, navigate, startCamera, stopCamera } from '../services/api';

const VisionSystem = () => {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [historyRes, statusRes] = await Promise.all([getDetections(), getStatus()]);
      setDetections(historyRes.data.slice(0, 8));
      setRunning(Boolean(statusRes.data.running));
      setCameraError(statusRes.data.last_error || '');
      if (statusRes.data.camera_available) {
        setStatus((currentStatus) => (currentStatus === 'Idle' ? 'Camera ready' : currentStatus));
      }
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const executeCommand = async (command) => {
    const normalized = command.toLowerCase();
    setActionBusy(true);
    setError('');

    try {
      if (normalized.includes('start camera')) {
        await startCamera();
        setRunning(true);
        setStatus('Laptop camera started');
      } else if (normalized.includes('stop camera')) {
        await stopCamera();
        setRunning(false);
        setStatus('Camera stopped');
        setCameraError('');
      } else if (normalized.includes('detect')) {
        await detectObjects();
        setStatus('Object detection enabled');
      } else if (normalized.includes('navigate')) {
        const res = await navigate();
        setStatus(`Navigation: ${res.data.direction}`);
      } else {
        setStatus('Unknown command');
      }
      await load();
    } catch (apiError) {
      setError(apiError.message);
      setStatus('Action failed');
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="glass-card rounded-4 p-3 p-lg-4 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <p className="page-section-title mb-1">Vision Control</p>
            <h2 className="h3 mb-1">Real-time smart vision dashboard</h2>
            <p className="text-muted mb-0">Control webcam streaming, run object detection, and trigger audio navigation support.</p>
          </div>
          <div className="status-pill">System Status: {status}</div>
        </div>
      </div>

      {error && (
        <div className="col-12">
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      )}

      <div className="col-lg-8">
        <CameraFeed running={running} lastError={cameraError} />
      </div>

      <div className="col-lg-4">
        <VoiceControl onCommand={executeCommand} isBusy={actionBusy} />
      </div>

      <div className="col-lg-8">
        <div className="glass-card rounded-4 p-3 p-lg-4">
          <p className="page-section-title mb-1">Manual Controls</p>
          <h4 className="mb-3">System actions</h4>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-success" onClick={() => executeCommand('start camera')} disabled={actionBusy}>Start Camera</button>
            <button className="btn btn-danger" onClick={() => executeCommand('stop camera')} disabled={actionBusy}>Stop Camera</button>
            <button className="btn btn-warning" onClick={() => executeCommand('detect objects')} disabled={actionBusy}>Detect Objects</button>
            <button className="btn btn-info text-white" onClick={() => executeCommand('navigate')} disabled={actionBusy}>Navigate</button>
            <button className="btn btn-outline-secondary" onClick={load} disabled={loading}>Refresh</button>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <ObjectList detections={detections} />
      </div>
    </div>
  );
};

export default VisionSystem;

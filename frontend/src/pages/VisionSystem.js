import React, { useEffect, useState } from 'react';
import CameraFeed from '../components/CameraFeed';
import VoiceControl from '../components/VoiceControl';
import ObjectList from '../components/ObjectList';
import { detectObjects, getDetections, getStatus, navigate, startCamera, stopCamera } from '../services/api';

const VisionSystem = () => {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [detections, setDetections] = useState([]);

  const load = async () => {
    const [historyRes, statusRes] = await Promise.all([getDetections(), getStatus()]);
    setDetections(historyRes.data.slice(0, 8));
    setRunning(statusRes.data.running);
  };

  useEffect(() => { load(); }, []);

  const executeCommand = async (command) => {
    if (command.includes('start camera')) {
      await startCamera();
      setRunning(true);
      setStatus('Camera started');
    } else if (command.includes('stop camera')) {
      await stopCamera();
      setRunning(false);
      setStatus('Camera stopped');
    } else if (command.includes('detect')) {
      await detectObjects();
      setStatus('Detection enabled');
    } else if (command.includes('navigate')) {
      const res = await navigate();
      setStatus(`Navigation: ${res.data.direction}`);
    } else {
      setStatus('Unknown command');
    }

    await load();
  };

  return (
    <div className="row g-4">
      <div className="col-lg-8"><CameraFeed running={running} /></div>
      <div className="col-lg-4"><VoiceControl onCommand={executeCommand} /></div>
      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-body d-flex gap-2 flex-wrap">
            <button className="btn btn-success" onClick={() => executeCommand('start camera')}>Start Camera</button>
            <button className="btn btn-danger" onClick={() => executeCommand('stop camera')}>Stop Camera</button>
            <button className="btn btn-warning" onClick={() => executeCommand('detect objects')}>Detect Objects</button>
            <button className="btn btn-info" onClick={() => executeCommand('navigate')}>Navigate</button>
            <span className="ms-auto fw-semibold">System Status: {status}</span>
          </div>
        </div>
      </div>
      <div className="col-lg-4"><ObjectList detections={detections} /></div>
    </div>
  );
};

export default VisionSystem;

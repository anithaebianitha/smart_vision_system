import React, { useCallback, useEffect, useState } from 'react';
import DetectionTable from '../components/DetectionTable';
import { deleteDetection, getDetections, updateDetection } from '../services/api';

const History = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getDetections();
      setDetections(res.data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    try {
      await deleteDetection(id);
      await load();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleUpdate = async (record) => {
    try {
      await updateDetection(record.id, { location: 'front' });
      await load();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div className="glass-card rounded-4 p-3 p-lg-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="page-section-title mb-1">History</p>
          <h3 className="mb-0">Detection history</h3>
        </div>
        <button className="btn btn-outline-secondary" onClick={load} disabled={loading}>Refresh</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <DetectionTable detections={detections} onDelete={handleDelete} onQuickUpdate={handleUpdate} loading={loading} />
    </div>
  );
};

export default History;

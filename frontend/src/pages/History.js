import React, { useEffect, useState } from 'react';
import DetectionTable from '../components/DetectionTable';
import { deleteDetection, getDetections, updateDetection } from '../services/api';

const History = () => {
  const [detections, setDetections] = useState([]);

  const load = async () => {
    const res = await getDetections();
    setDetections(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await deleteDetection(id);
    await load();
  };

  const handleUpdate = async (record) => {
    await updateDetection(record.id, { location: 'front' });
    await load();
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">Detection History</div>
      <div className="card-body">
        <DetectionTable detections={detections} onDelete={handleDelete} onQuickUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default History;

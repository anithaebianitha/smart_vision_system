import React from 'react';

const ObjectList = ({ detections }) => (
  <div className="card shadow-sm h-100">
    <div className="card-header">Detected Objects</div>
    <ul className="list-group list-group-flush">
      {detections.length === 0 && <li className="list-group-item text-muted">No detections yet.</li>}
      {detections.map((item) => (
        <li key={item.id} className="list-group-item d-flex justify-content-between">
          <span>{item.object_name} ({Math.round(item.confidence * 100)}%)</span>
          <span className="badge text-bg-secondary">{item.location}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ObjectList;

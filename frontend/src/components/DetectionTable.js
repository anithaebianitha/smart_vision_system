import React from 'react';

const DetectionTable = ({ detections, onDelete, onQuickUpdate }) => (
  <div className="table-responsive">
    <table className="table table-striped table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>Object</th>
          <th>Confidence</th>
          <th>Location</th>
          <th>Timestamp</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {detections.map((d) => (
          <tr key={d.id}>
            <td>{d.object_name}</td>
            <td>{(d.confidence * 100).toFixed(1)}%</td>
            <td>{d.location}</td>
            <td>{new Date(d.timestamp).toLocaleString()}</td>
            <td>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onQuickUpdate(d)}>Update</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(d.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DetectionTable;

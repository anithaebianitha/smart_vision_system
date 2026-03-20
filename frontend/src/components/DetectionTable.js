import React from 'react';

const DetectionTable = ({ detections, onDelete, onQuickUpdate, loading }) => (
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th>Object</th>
          <th>Confidence</th>
          <th>Location</th>
          <th>Timestamp</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="5" className="text-center py-4 text-muted">Loading detection history...</td>
          </tr>
        )}
        {!loading && detections.length === 0 && (
          <tr>
            <td colSpan="5" className="text-center py-4 text-muted">No detections available.</td>
          </tr>
        )}
        {!loading && detections.map((d) => (
          <tr key={d.id}>
            <td className="text-capitalize">{d.object_name}</td>
            <td>{(d.confidence * 100).toFixed(1)}%</td>
            <td className="text-capitalize">{d.location}</td>
            <td>{new Date(d.timestamp).toLocaleString()}</td>
            <td>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onQuickUpdate(d)}>Mark Front</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(d.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DetectionTable;

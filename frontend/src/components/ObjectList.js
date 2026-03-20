import React from 'react';

const ObjectList = ({ detections }) => (
  <div className="glass-card rounded-4 p-3 p-lg-4 h-100">
    <p className="page-section-title mb-1">Recent Results</p>
    <h4 className="mb-3">Detected objects</h4>
    {detections.length === 0 ? (
      <div className="alert alert-light border mb-0">No detections recorded yet.</div>
    ) : (
      <div className="d-flex flex-column gap-2">
        {detections.map((item) => (
          <div key={item.id} className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 bg-white">
            <div>
              <div className="fw-semibold text-capitalize">{item.object_name}</div>
              <small className="text-muted">Confidence: {Math.round(item.confidence * 100)}%</small>
            </div>
            <span className="badge text-bg-primary text-capitalize">{item.location}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ObjectList;

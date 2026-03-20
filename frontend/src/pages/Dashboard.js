import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getDetections } from '../services/api';

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDetections();
        setDetections(res.data);
      } catch (apiError) {
        setError(apiError.message);
      }
    };

    load();
  }, []);

  const grouped = useMemo(() => detections.reduce((acc, item) => {
    acc[item.object_name] = (acc[item.object_name] || 0) + 1;
    return acc;
  }, {}), [detections]);

  const highestConfidence = useMemo(() => {
    if (detections.length === 0) {
      return 0;
    }
    return Math.max(...detections.map((item) => item.confidence));
  }, [detections]);

  useEffect(() => {
    if (!chartRef.current) {
      return undefined;
    }

    chartInstanceRef.current?.destroy();
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(grouped),
        datasets: [{
          label: 'Detections',
          data: Object.values(grouped),
          backgroundColor: ['#2563eb', '#7c3aed', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444']
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    return () => chartInstanceRef.current?.destroy();
  }, [grouped]);

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="glass-card rounded-4 p-3 p-lg-4">
          <p className="page-section-title mb-1">Analytics</p>
          <h3 className="mb-0">Admin dashboard</h3>
        </div>
      </div>

      {error && (
        <div className="col-12">
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      )}

      <div className="col-md-4">
        <div className="card metric-card shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-2">Total detections</p>
            <h2 className="fw-bold mb-0">{detections.length}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card metric-card shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-2">Unique objects</p>
            <h2 className="fw-bold mb-0">{Object.keys(grouped).length}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card metric-card shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-2">Highest confidence</p>
            <h2 className="fw-bold mb-0">{(highestConfidence * 100).toFixed(1)}%</h2>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="glass-card rounded-4 p-3 p-lg-4 h-100">
          <p className="page-section-title mb-1">Distribution</p>
          <h4 className="mb-3">Object detection chart</h4>
          {Object.keys(grouped).length === 0 ? (
            <div className="alert alert-light border mb-0">No detection data available for chart rendering.</div>
          ) : (
            <canvas ref={chartRef} height="120" />
          )}
        </div>
      </div>

      <div className="col-lg-4">
        <div className="glass-card rounded-4 p-3 p-lg-4 h-100">
          <p className="page-section-title mb-1">Insights</p>
          <h4 className="mb-3">Object breakdown</h4>
          <div className="d-flex flex-column gap-2">
            {Object.entries(grouped).map(([name, count]) => (
              <div key={name} className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 bg-white">
                <span className="text-capitalize fw-semibold">{name}</span>
                <span className="badge text-bg-primary">{count}</span>
              </div>
            ))}
            {Object.keys(grouped).length === 0 && <div className="text-muted">No detections available.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

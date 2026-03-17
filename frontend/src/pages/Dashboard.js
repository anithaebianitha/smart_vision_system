import React, { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getDetections } from '../services/api';

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [detections, setDetections] = React.useState([]);

  useEffect(() => {
    getDetections().then((res) => setDetections(res.data));
  }, []);

  const grouped = useMemo(() => {
    return detections.reduce((acc, item) => {
      acc[item.object_name] = (acc[item.object_name] || 0) + 1;
      return acc;
    }, {});
  }, [detections]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstanceRef.current?.destroy();
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(grouped),
        datasets: [{ data: Object.values(grouped) }]
      }
    });
  }, [grouped]);

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5>Total Detections</h5>
            <p className="display-6 fw-bold">{detections.length}</p>
            <p className="text-muted mb-0">Real-time stats from MongoDB collection.</p>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card shadow-sm h-100">
          <div className="card-header">Object Distribution</div>
          <div className="card-body">
            <canvas ref={chartRef} height="120" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

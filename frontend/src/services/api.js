import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
});

export const getDetections = () => api.get('/detections');
export const createDetection = (payload) => api.post('/detections', payload);
export const updateDetection = (id, payload) => api.put(`/detections/${id}`, payload);
export const deleteDetection = (id) => api.delete(`/detections/${id}`);

export const startCamera = () => api.post('/start-camera');
export const stopCamera = () => api.post('/stop-camera');
export const detectObjects = () => api.post('/detect-objects');
export const navigate = () => api.post('/navigate');
export const getStatus = () => api.get('/status');

export const cameraFeedUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/camera-feed`;

export default api;

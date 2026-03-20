import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

const extractErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error.message) {
    return error.message;
  }

  return 'Unexpected API error';
};

const request = async (callback) => {
  try {
    return await callback();
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getDetections = () => request(() => api.get('/detections'));
export const createDetection = (payload) => request(() => api.post('/detections', payload));
export const updateDetection = (id, payload) => request(() => api.put(`/detections/${id}`, payload));
export const deleteDetection = (id) => request(() => api.delete(`/detections/${id}`));

export const startCamera = () => request(() => api.post('/start-camera'));
export const stopCamera = () => request(() => api.post('/stop-camera'));
export const detectObjects = () => request(() => api.post('/detect-objects'));
export const navigate = () => request(() => api.post('/navigate'));
export const getStatus = () => request(() => api.get('/status'));

export const cameraFeedUrl = `${API_BASE_URL}/camera-feed`;

export default api;

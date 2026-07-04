import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to format errors uniformly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;
    
    // Construct a uniform error format
    const formattedError = {
      message: errorData?.error?.message || errorData?.message || 'An unexpected error occurred.',
      code: errorData?.error?.code || 'API_ERROR',
      status: error.response?.status || 500,
      details: errorData?.error?.details || null
    };
    
    return Promise.reject(formattedError);
  }
);

export default api;

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'A network error occurred. Please try again.'
    };
    return Promise.reject(apiError);
  }
);

export default httpClient;

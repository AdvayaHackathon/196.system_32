// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Helper function to handle API requests
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the original request with new token
        const newToken = localStorage.getItem('token');
        config.headers['Authorization'] = `Bearer ${newToken}`;
        return fetch(`${API_URL}${endpoint}`, config);
      } else {
        // Redirect to login if refresh failed
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Refresh token function
export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

// Format error messages
export const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
}; 
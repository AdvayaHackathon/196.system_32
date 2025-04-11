const API_BASE_URL = 'http://localhost:3001/api'; // Your backend API base URL

/**
 * Makes an authenticated API request.
 * 
 * @param {string} endpoint The API endpoint (e.g., '/users/me').
 * @param {string} method The HTTP method (e.g., 'GET', 'POST').
 * @param {object} [body=null] The request body for POST/PUT requests.
 * @param {string} [token=null] The JWT authentication token.
 * @returns {Promise<object>} The JSON response data.
 * @throws {Error} If the request fails or returns an error status.
 */
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        // Use error message from backend if available, otherwise use status text
        throw new Error(data.error || response.statusText || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request error for ${method} ${endpoint}:`, error);
    // Re-throw the error so calling components can handle it
    throw error; 
  }
};

export default apiRequest; 
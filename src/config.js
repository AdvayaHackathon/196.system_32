const isDevelopment = window.location.hostname === 'localhost';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:5000'
    : 'https://carelink3.azurewebsites.net',
  auth: {
    loginEndpoint: '/api/auth/login',
    registerEndpoint: '/api/auth/register'
  },
  errorMessages: {
    default: 'An error occurred. Please try again.',
    invalidCredentials: 'Invalid email or password',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.'
  }
};

export default config; 
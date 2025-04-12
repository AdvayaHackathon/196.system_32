import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const url = `${config.apiUrl}${config.auth.loginEndpoint}`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify({ 
          email: email.trim(),
          password: password 
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers]));

      // Try to get the response text first
      let responseText;
      try {
        responseText = await response.text();
        console.log('Raw response:', responseText);
      } catch (textError) {
        console.error('Error reading response:', textError);
        throw new Error('Unable to read server response');
      }

      // Try to parse the JSON
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        console.error('Raw response was:', responseText);
        throw new Error('Server returned invalid JSON. Please try again.');
      }

      if (!response.ok) {
        const errorMessage = data?.error || 'Login failed. Please try again.';
        console.error('Login failed:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data || !data.token || !data.user) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid server response format');
      }

      await login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || config.errorMessages.default);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use these test credentials:
          </p>
          <p className="text-center text-xs text-gray-500">
            Email: doctor@example.com<br/>
            Password: CareLink@2024
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
              <button 
                type="button"
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError('')}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4 fill-current" role="button" viewBox="0 0 20 20">
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
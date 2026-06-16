import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`https://bus-pass-backend-production.up.railway.app/api/auth/login`, {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      if (user.role === 'DRIVER') {
        if (!user.routeId) {
          setError('You are not assigned to any route. Contact Admin.');
          return;
        }
        localStorage.setItem('driverToken', token);
        localStorage.setItem('driverRouteId', user.routeId);
        localStorage.setItem('driverUsername', user.username);
        window.location.href = '/driver';
      } else {
        localStorage.setItem('token', token);
        // Setup axios default auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-primary">
            Bus Pass System
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Sign in to the Admin Portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">Username</label>
              <input
                name="username"
                type="text"
                required
                className="input-field"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full btn-primary py-3 text-lg">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

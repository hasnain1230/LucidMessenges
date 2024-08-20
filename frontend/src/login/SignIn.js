import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { AUTH_ENDPOINTS } from '../config';
import { useAuth } from '../AuthContext';

function SignIn() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email/username': identifier,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'An error occurred during sign in';
        setError(errorMessage);
        return;
      }

      login(data.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-in-container">
      <motion.div
        className="sign-in-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}  {}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="identifier">Email Address / Username</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="sign-in-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </form>
        <motion.a
          href="/forgot-password"
          className="forgot-password"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Forgot your password?
        </motion.a>
      </motion.div>
    </div>
  );
}

export default SignIn;
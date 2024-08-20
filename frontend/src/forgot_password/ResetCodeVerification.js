import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetCodeVerification.css';
import { AUTH_ENDPOINTS } from '../config';

function ResetCodeVerification() {
  const [resetCode, setResetCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is missing. Please go back to the forgot password page.');
      return;
    }

    try {
      const response = await fetch(AUTH_ENDPOINTS.VERIFY_RESET_CODE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reset_code: resetCode })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred. Please try again.');
        return;
      }

      navigate('/reset-password', { state: { email, resetCode } });
    } catch (error) {
      console.error('Reset code verification error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="reset-code-container">
      <motion.div
        className="reset-code-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Enter Reset Code</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="resetCode">Reset Code</label>
            <input
              type="text"
              id="resetCode"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="verify-code-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Verify Code
          </motion.button>
        </form>
        <motion.a
          href="/forgot-password"
          className="back-link"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Forgot Password
        </motion.a>
      </motion.div>
    </div>
  );
}

export default ResetCodeVerification;
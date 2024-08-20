import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SignUp.css';
import { AUTH_ENDPOINTS } from '../config';
import VerificationCodeInput from './VerificationInput';

function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }

    try {
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password, confirmed_password: confirmPassword})
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during registration');
      }

      setIsRegistered(true);
      setMessage("Please check your email for a verification code.");

    } catch (error) {
      setError(error.message);
    }
  };

  const handleVerificationSubmit = (data, response) => {
    if (!response.ok) {
      setError(data['error']);
      setMessage('');
    } else {
      setIsVerified(true);
      setError('');
      setMessage('Your account has been created successfully. You can now sign in.');
    }
  };


  return (
    <div className="sign-up-container">
      <motion.div
        className="sign-up-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>{isRegistered ? (isVerified ? 'Account Created' : 'Verify Email') : 'Sign Up'}</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        {!isRegistered && (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="username">Desired Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
              <label htmlFor="agreeToTerms">I agree to the Terms of Service</label>
            </div>
            <motion.button
              type="submit"
              className="sign-up-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </form>
        )}
        {isRegistered && !isVerified && (
          <VerificationCodeInput 
            email={email} 
            onSubmit={handleVerificationSubmit}
          />
        )}
      </motion.div>
    </div>
  );
}


export default SignUp;
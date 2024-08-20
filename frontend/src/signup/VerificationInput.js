import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AUTH_ENDPOINTS } from '../config';

function VerificationCodeInput({ email, onSubmit }) {
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(AUTH_ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, verification_code: code})
    });

    const data = await response.json();


    onSubmit(data, response);

  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="verificationCode">Verification Code</label>
        <input
          type="text"
          id="verificationCode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <motion.button
        type="submit"
        className="sign-up-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Verify
      </motion.button>
    </form>
  );
}

export default VerificationCodeInput;
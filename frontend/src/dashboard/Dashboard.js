import React from 'react';
import { motion } from 'framer-motion';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Dashboard</h1>
        <p>Sign In Successful, But This Feature Is Not Ready Yet. Fight me, I'm trying my best</p>
      </motion.div>
    </div>
  );
}

export default Dashboard;
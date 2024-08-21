import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import SignIn from './login/SignIn';
import SignUp from './signup/SignUp';
import Dashboard from './dashboard/Dashboard';
import ForgotPassword from './forgot_password/ForgotPassword';
import ResetCodeVerification from './forgot_password/ResetCodeVerification';
import ResetPassword from './forgot_password/ResetPassword';
import { AuthProvider, useAuth } from './AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

function AppContent() {
    const { isAuthenticated, logout, isLoading, username } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;  // Or a more sophisticated loading component
    }

    return (
        <div className="App">
            <header className="App-header">
                <nav className="navbar">
                    <Link to="/" className="logo-link">
                        <motion.div
                            className="logo"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            LucidMessenger
                        </motion.div>
                    </Link>
                    <ul className="nav-links">
                        {!isAuthenticated ? (
                            <>
                                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Link to="/login" className="cta-button">Login</Link>
                                </motion.li>
                                <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Link to="/signup" className="cta-button">Sign Up</Link>
                                </motion.li>
                            </>
                        ) : (
                            <div className="user-menu">
                                <motion.div className="welcome-message">
                                    Welcome, {username}!
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <button onClick={logout} className="cta-button">Sign Out</button>
                                </motion.div>
                            </div>
                        )}
                    </ul>
                </nav>
                <div className="content-container">
                    <Routes>
                        <Route path="/login" element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" />} />
                        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />
                        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
                        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-reset-code" element={<ResetCodeVerification />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                </div>
            </header>
            <footer>
                <p>© 2024 LucidMessenger. All rights reserved.</p>
            </footer>
        </div>
    );
}

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="header-content">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Welcome to LucidMessenger
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                Your secure and private messaging platform.
            </motion.p>
            {!isAuthenticated && (
                <div className="button-container">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/login" className="cta-button">Login</Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/signup" className="cta-button">Sign Up</Link>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default App;

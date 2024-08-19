import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import SignIn from './login/SignIn';
import SignUp from './signup/SignUp'

function App() {
    return (
        <Router>
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
                            <motion.li
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link to="/login" className="cta-button">Login</Link>
                            </motion.li>
                            <motion.li
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link to="/signup" className="cta-button">Sign Up</Link>
                            </motion.li>
                        </ul>
                    </nav>
                    <div className="content-container">
                        <Routes>
                            <Route path="/login" element={<SignIn />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </div>
                </header>
                <footer>
                    <p>© 2024 LucidMessenger. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

function Home() {
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
            <div className="button-container">
                <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/login">Login</Link>
                </motion.button>
                <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/signup">Sign Up</Link>
                </motion.button>
            </div>
        </div>
    );
}

export default App;
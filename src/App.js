import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <div className="logo">LucidMessenger</div>
          <ul className="nav-links">
            <li><a href="#login" className="cta-button">Login</a></li>
            <li><a href="#signup" className="cta-button">Sign Up</a></li>
          </ul>
        </nav>
        <div className="header-content">
          <h1>Welcome to LucidMessenger</h1>
          <p>Your secure and private messaging platform.</p>
          <div className="button-container">
            <button className="cta-button">Login</button>
            <button className="cta-button">Sign Up</button>
          </div>
        </div>
      </header>
      <footer>
        <p>© 2024 LucidMessenger. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

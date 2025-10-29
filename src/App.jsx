import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import ConversationHistory from './components/ConversationHistory';
import Sidebar from "./components/Sidebar";
import { FaBars } from "react-icons/fa";
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        {/* Hamburger Icon - visible only on small screens */}
        <div className="mobile-menu-icon" onClick={toggleSidebar}>
          <FaBars />
        </div>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ChatInterface />} />
            <Route path="/history" element={<ConversationHistory />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

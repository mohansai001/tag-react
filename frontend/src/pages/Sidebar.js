import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const navigateTo = (path) => {
    navigate(path);
    setSidebarVisible(false); // Close sidebar after navigation
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button 
        id="toggle-sidebar-btn" 
        onClick={toggleSidebar}
        className={sidebarVisible ? 'active' : ''}
      >
        {sidebarVisible ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar-menu ${sidebarVisible ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        
        <div className="sidebar-options">
          <div 
            className="sidebar-option" 
            onClick={() => navigateTo('/dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </div>
          
          <div 
            className="sidebar-option" 
            onClick={() => navigateTo('/ec-selection')}
          >
            <i className="fas fa-users"></i>
            <span>Recruit</span>
          </div>
          
          <div 
            className="sidebar-option" 
            onClick={() => navigateTo('/prescreening')}
          >
            <i className="fas fa-tasks"></i>
            <span>GT's Prescreening</span>
          </div>
          
          <div 
            className="sidebar-option" 
            onClick={() => navigateTo('/tracking')}
          >
            <i className="fas fa-tasks"></i>
            <span>RRF Tracking</span>
          </div>
          
          <div 
            className="sidebar-option logout-option" 
            onClick={() => navigateTo('/logout')}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarVisible && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
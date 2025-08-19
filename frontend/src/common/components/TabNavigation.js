import React from 'react';
const TabNavigation = ({ tabs = [], active, onTabChange }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {tabs.map(tab => (
      <button key={tab} onClick={() => onTabChange(tab)} style={{ fontWeight: active === tab ? 'bold' : 'normal' }}>{tab}</button>
    ))}
  </div>
);
export default TabNavigation;

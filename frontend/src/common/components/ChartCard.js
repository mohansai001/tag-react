import React from 'react';
const ChartCard = ({ title, children }) => (
  <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, margin: 8 }}>
    <h3>{title}</h3>
    {children}
  </div>
);
export default ChartCard;

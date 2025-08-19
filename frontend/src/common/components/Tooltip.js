import React from 'react';
const Tooltip = ({ text, children }) => (
  <span style={{ position: 'relative', cursor: 'pointer' }}>
    {children}
    <span style={{
      visibility: 'hidden',
      backgroundColor: '#333',
      color: '#fff',
      textAlign: 'center',
      borderRadius: 4,
      padding: '4px 8px',
      position: 'absolute',
      zIndex: 1,
      bottom: '125%',
      left: '50%',
      marginLeft: '-60px',
      width: 120
    }}>{text}</span>
  </span>
);
export default Tooltip;

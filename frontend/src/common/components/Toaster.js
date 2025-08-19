import React from 'react';
const Toaster = ({ message, show }) => (
  show ? (
    <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#333', color: '#fff', padding: '12px 24px', borderRadius: 8, zIndex: 2000 }}>
      {message}
    </div>
  ) : null
);
export default Toaster;

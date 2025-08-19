import React from 'react';

const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '1rem' }}>
    <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #eee', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;

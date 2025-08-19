import React from 'react';
const ModalPopup = ({ open, onClose, children }) => (
  open ? (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}>
      <div style={{ background: '#fff', margin: '10% auto', padding: 20, borderRadius: 8, width: 'fit-content', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8 }}>×</button>
        {children}
      </div>
    </div>
  ) : null
);
export default ModalPopup;

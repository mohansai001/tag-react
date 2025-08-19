import React from 'react';
const Pagination = ({ current, total, onChange }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {[...Array(total).keys()].map(i => (
      <button key={i} onClick={() => onChange(i + 1)} style={{ fontWeight: current === i + 1 ? 'bold' : 'normal' }}>{i + 1}</button>
    ))}
  </div>
);
export default Pagination;

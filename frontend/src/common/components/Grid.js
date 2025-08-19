import React from 'react';
const Grid = ({ children, columns = 2, gap = 16, ...props }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }} {...props}>
    {children}
  </div>
);
export default Grid;

import React from 'react';
const Card = ({ children, ...props }) => (
  <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: 8 }} {...props}>
    {children}
  </div>
);
export default Card;

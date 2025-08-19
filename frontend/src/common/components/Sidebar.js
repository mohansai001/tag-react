import React from 'react';
const Sidebar = ({ children, width = 220, ...props }) => (
  <aside style={{ width, background: '#f5f5f5', height: '100vh', padding: 16, ...props.style }} {...props}>
    {children}
  </aside>
);
export default Sidebar;

import React from 'react';
const Breadcrumbs = ({ items = [] }) => (
  <nav aria-label="breadcrumb">
    <ol style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginRight: 8 }}>
          {item}
          {i < items.length - 1 && <span style={{ margin: '0 8px' }}>/</span>}
        </li>
      ))}
    </ol>
  </nav>
);
export default Breadcrumbs;

import React from 'react';
const TextArea = ({ label, value, onChange, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <textarea value={value} onChange={onChange} {...props} />
  </div>
);
export default TextArea;

import React from 'react';
const RadioButton = ({ label, checked, onChange, ...props }) => (
  <label>
    <input type="radio" checked={checked} onChange={onChange} {...props} />
    {label}
  </label>
);
export default RadioButton;

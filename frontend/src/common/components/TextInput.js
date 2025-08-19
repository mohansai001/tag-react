import React from 'react';

const TextInput = ({ label, value, onChange, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <input type="text" value={value} onChange={onChange} {...props} />
  </div>
);

export default TextInput;

import React from 'react';
const NumberInput = ({ label, value, onChange, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <input type="number" value={value} onChange={onChange} {...props} />
  </div>
);
export default NumberInput;

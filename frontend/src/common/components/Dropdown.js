import React from 'react';

const Dropdown = ({ label, options, value, onChange, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <select value={value} onChange={onChange} {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default Dropdown;

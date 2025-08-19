import React from 'react';
const DatePicker = ({ value, onChange, ...props }) => (
  <input type="date" value={value} onChange={onChange} {...props} />
);
export default DatePicker;

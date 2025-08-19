import React from 'react';
const DateRangePicker = ({ start, end, onStartChange, onEndChange }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    <input type="date" value={start} onChange={onStartChange} />
    <span>to</span>
    <input type="date" value={end} onChange={onEndChange} />
  </div>
);
export default DateRangePicker;

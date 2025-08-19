import React from 'react';
const FileUpload = ({ label, multiple = false, onChange, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <input type="file" multiple={multiple} onChange={onChange} {...props} />
  </div>
);
export default FileUpload;

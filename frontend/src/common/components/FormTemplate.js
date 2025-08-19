import React from 'react';
const FormTemplate = ({ children, onSubmit, ...props }) => (
  <form onSubmit={onSubmit} {...props}>
    {children}
  </form>
);
export default FormTemplate;

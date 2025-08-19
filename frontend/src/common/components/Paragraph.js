import React from 'react';
const Paragraph = ({ children, ...props }) => <p {...props}>{children}</p>;
export default Paragraph;

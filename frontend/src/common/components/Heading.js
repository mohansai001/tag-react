import React from 'react';
const Heading = ({ level = 1, children, ...props }) => {
  const Tag = `h${level}`;
  return <Tag {...props}>{children}</Tag>;
};
export default Heading;

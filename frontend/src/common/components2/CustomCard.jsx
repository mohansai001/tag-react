import React from 'react';
import { Card, CardContent } from '@mui/material';

const CustomCard = ({ children, sx = {}, contentSx={}, ...props }) => (
  <Card
    sx={{
      boxShadow: 2,
      borderRadius: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx
    }}
    {...props}
  >
    <CardContent
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        ...contentSx
      }}
    >
      {children}
    </CardContent>
  </Card>
);

export default CustomCard;
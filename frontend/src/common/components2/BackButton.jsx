// BackButton.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Tooltip } from '@mui/material';

const BackButton = ({ to, sx }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (to) {
      navigate(to); // Use custom path if provided
    } else {
      // Auto go to parent path
      const segments = location.pathname.split('/').filter(Boolean);
      const parentPath = '/' + segments.slice(0, -1).join('/');
      navigate(parentPath || '/'); // fallback to root if needed
    }
  };

  return (
     <Tooltip title="Back">
      <IconButton 
        onClick={handleBack}
        sx={{
          color:'black',
          width: 40,
          height: 40,
          borderRadius: '50%',  
          backgroundColor: 'whitesmoke',
          ...sx, // Allow override or extra custom styles
        }}>
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;

import React from 'react'
import { Button } from '@mui/material';

const CustomButton = ({children, onClick, type='submit', sx = {}, ...props}) => {
  return (
    <Button
        type={type}
        onClick={onClick}
        {...props}
        variant="contained"
        color="black"
        disableElevation
        sx={{
            bgcolor: '#DCF4B6',
            //width: '60%',
            mt: 1,
            fontSize: '12px',
            py: 1,
             '&:hover': {
              color: '#807D76 !important',
            },
            ...sx
        }}
    >
        {children}
    </Button>
  )
}

export default CustomButton

import React from 'react';
import { InputBase, Box} from '@mui/material';


const SearchInput = ({
  value,
  onChange,
  placeholder,
  sx = {},
  ...props
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      mb: 2,
      height: { xs: 22, sm: 32, md: 32 },
      
    }}
  >
    <InputBase
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        bgcolor: '#fff',
        px: 2,
        py: 1,
        border: 'none',
        borderRadius: '1px',
        fontSize: 14,
        //width:'100%',
        // flex: 1,
        // boxShadow: '0 2px 8px 0 #e8e8e8',
        ...sx,
      }}
      fullWidth


      
    />
  </Box>
);

export default SearchInput;
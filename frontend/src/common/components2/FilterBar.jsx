import React from 'react';
import { Paper, Typography } from '@mui/material';

const FilterBar = ({
  dateFilter,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApply
}) => (
  <Paper
    elevation={3}
    sx={{
      bgcolor: '#fff',
      borderRadius: 3,
      p: { xs: 1, sm: 1, md: 1 },
      mb: { xs: 1.2, sm: 1.2 },
      mt: 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1.5,
      flexWrap: 'wrap',
      boxShadow: 2,
      minWidth: 260,
      maxWidth: '100%',
      fontSize: { xs: '9px', sm: '12px', md: '12px' },
      mx: { xs: 1, sm: 'auto' }
    }}
  >
    <Typography  fontWeight="bold" sx={{ mr: 1, fontSize: { xs: 9, sm: 12, md: 12 } }}>
      Filter Candidates by Date
    </Typography>
    <select
      value={dateFilter}
      onChange={e => setDateFilter(e.target.value)}
      style={{
        padding: '4px 10px',
        borderRadius: 6,
        border: '1px solid #ccc',
        fontSize: '12px',
        marginRight: 6,
        minWidth: 110,
        width: 'auto',
      }}
    >
      <option>Last 24 Hours</option>
      <option>Last 1 Week</option>
      <option>Last 15 Days</option>
      <option>Custom Range</option>
    </select>
    {dateFilter === 'Custom Range' && (
      <>
        <Typography sx={{ fontSize: 'inherit', mr: 1 }}>Start Date:</Typography>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          style={{
            padding: '4px 6px',
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 'inherit',
            marginRight: 6,
            minWidth: 110
          }}
          placeholder="dd-mm-yyyy"
        />
        <Typography sx={{ fontSize: 'inherit', mr: 1 }}>End Date:</Typography>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          style={{
            padding: '4px 6px',
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 'inherit',
            marginRight: 6,
            minWidth: 110
          }}
          placeholder="dd-mm-yyyy"
        />
      </>
    )}
    <button
      style={{
        padding: '4px 12px',
        borderRadius: 6,
        border: '1px solid #888',
        background: 'rgb(229 227 227)',
        fontWeight: 500,
        fontSize: 'inherit',
        cursor: 'pointer',
      }}
      onClick={onApply}
    >
      Apply Filter
    </button>
  </Paper>
);

export default FilterBar;
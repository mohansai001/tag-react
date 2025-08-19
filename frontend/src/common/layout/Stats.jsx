import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import chartData from '../../data/ChartData.json'

const StatsCard = ({ count, label }) => (
  <Card sx={{
    backgroundColor: '#e6ffb3',
    minWidth: 100,
    width: { xs: 140, sm: 160, md: 120 },
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 3,
    borderRadius: 4,
    transition: 'box-shadow 0.3s, transform 0.3s',
      '&:hover': {
        boxShadow: 8,
        transform: 'translateY(-8px)',
        cursor: 'pointer'
      }
  }}>
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" component="div" fontWeight="bold">
        {count}
      </Typography>
      <Typography variant="body2" component="p" color="text.secondary">
        {label}
      </Typography>
    </CardContent>
  </Card>
)

const Stats = () => (
  <Grid container spacing={1} justifyContent="center">
    {chartData.StatsCards.map((item, idx) => (
      <Grid item key={idx}>
        <StatsCard count={item.count} label={item.label} />
      </Grid>
    ))}
  </Grid>
)

export default Stats
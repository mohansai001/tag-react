import React, { useState, useMemo } from 'react'
import {Box, Typography, Paper} from '@mui/material'
import BarChart from '../components2/BarChart'
import chartData from '../../data/ChartData.json'
import SearchInput from '../components2/SearchInput'

// const leadership = chartData.LeadershipDashboard[0];
// // const legendItems = leadership.datasets.map(ds => ({
// //   label: ds.label,
// //   color: ds.backgroundColor
// // }))

const leadership = chartData.LeadershipDashboard[0];
// const legendItems = leadership.datasets.map(ds => ({
//   label: ds.label,
//   color: ds.backgroundColor
// }))

const LeadershipDashboard = () => {
  const [filter, setFilter] = useState('')

  // Filter datasets by label or Email (case-insensitive)
  const filteredDatasets = useMemo(() => {
    if (!filter.trim()) return leadership.datasets
    const lower = filter.trim().toLowerCase()
    return leadership.datasets
      .filter(ds =>
        ds.label.toLowerCase().includes(lower) ||
        (ds.Email && ds.Email.toLowerCase().includes(lower))
      )
  }, [filter, leadership.datasets])

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper sx={{
        borderRadius: 4,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        boxSizing: 'border-box'
      }}>
        <Typography fontSize={16} color='black' align="center" fontWeight="bold" sx={{ mb: 2 }}>
          {leadership.title}
        </Typography>
        <Box sx={{boxShadow: 2 , display: 'flex', justifyContent: 'center', mb: 2, height:{xs:20,sm:30,md:30}, width:{xs:112,sm:142,md:142},borderRadius: 1 ,p:1 }}>
          {/* <Box sx={{ px: 2,border:'1px solid #a1a1a1' ,borderRadius: 1 }}>
            <InputBase
              placeholder="Search by email, short nam"
              sx={{ width: '100%', height:'100%', fontSize: 12 }}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </Box> */}
          <SearchInput
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search by email, short name"
            
            sx={{
                height: { xs: 15, sm: 20, md: 20 },
                padding: '0px',
                border: 'none',
                }
              }
          />
        </Box>       
        <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
          <BarChart
            labels={leadership.labels}
            pointStyle= 'true'
            datasets={filteredDatasets}
            height="100%"
            options={{
              plugins: {
                legend: { display: true, labels: {usePointStyle: true, pointStyle: 'circle'} },
                tooltip: {
                callbacks: {
                label: function(context) {
                  
                    // Show Email instead of label
                    const ds = context.dataset;
                    const value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                    return `${ds.Email}: ${value}`;
                }
                }
            },
                
                datalabels: { display: false }
              },
              scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, beginAtZero: true, ticks: { precision: 0, maxTicksLimit: 10, callback: value => Number.isInteger(value) ? value : ''  }, grid: { display: true, borderColor:'##F4F4F4',color:'#F4F4F4', lineWidth:1, borderWidth:1 } }
              },
              maintainAspectRatio: false
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default LeadershipDashboard
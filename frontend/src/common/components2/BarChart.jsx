import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

const BarChart = ({
  labels = [],
  datasets,
  chartTitle = '',
  data,
  pointStyle= false,
  backgroundColor,
  datalabelsColor = '#555',
  datalabelsFontSize = '0.5rem',
  options = {}
}) => {
  // If datasets prop is provided, use it; else build a single dataset from data/backgroundColor
  const chartData = {
    labels,
    datasets: datasets && datasets.length
      ? datasets
      : [
          {
            data: data || [],
            backgroundColor: backgroundColor || [],
          }
        ]
  }

  const defaultOptions = {
    responsive: true,
  maintainAspectRatio: false,
    plugins: {
      legend: { display: false , 
        labels: {
        font: { size: 5 },
        usePointStyle: pointStyle,

      }
      },
      
      title: {
        display: !!chartTitle,
        color: 'black',
        text: chartTitle,
        font: { size: 14, weight: 'bold' },
        margin: { top: 10, bottom: 30 }
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: datalabelsColor,
        font: {
          weight: 'bold',
          size: datalabelsFontSize,
        },
        formatter: (value) => value,
      },
    },
    scales: {
      y: {
    beginAtZero: true,
    ticks: {
      precision: 0, // No decimals
      maxTicksLimit: 6, // Limit number of ticks (adjust as needed)
      callback: value => Number.isInteger(value) ? value : '', // Only show integer ticks
    }
        
      },
      x: {
      
        grid: {
          display: true // This disables vertical grid lines
        },
      
        ticks: {
          font: {
            size: '10%' // <-- x-axis font size (your JSON labels)
          }
        }
      }
    },
    
    ...options
  }

  return (
    <Bar
      data={chartData}
      options={defaultOptions}
      plugins={[ChartDataLabels]}
    />
  )
}

export default BarChart
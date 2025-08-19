import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
//import { BorderAllRounded } from '@mui/icons-material'

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels)



const DoughnutChart = ({
  labels = [],
  data = [],
  backgroundColor = [],
  chartTitle = '',
  TitleFontSize = 14,
  TitleFontWeight = 'bold',
  centerText = '',
  centerTextLabel= '',
  centerTextColor = '#ccc',
  centerTextLabelColor = '#888',
  centerTextSize = 28,
  legendFontSize = { xs: 4, sm: 4, md: 6 },
  legendDisplay = true,
  legendPosition = 'bottom',
  datalabelsColor = '#888',
  datalabelsFontSize = 18,
  options = {},
  pointStyle= false,
  cutout = '50%',
  borderWidth=0,
  // maxheight=148,
  // height = 148,
  // width = 392,
  divideHeight={xs:0.75, sm: 1.3, md: 1.3},
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: borderWidth ,
        borderColor: '#fff',
      }
    ]
  }



  const defaultOptions = {
    responsive: true,
  maintainAspectRatio: false,
    cutout: cutout,
    plugins: {
      legend: {
        display: legendDisplay,
        position:legendPosition,
        borderRadius:50,
        align:'center',
        labels: {
          boxWidth: 18,
          font: {size: '10%' },
           usePointStyle: pointStyle,      // <-- add this line
          
        }
      },
      title: {
        display: !!chartTitle,
        color: 'black',
        text: chartTitle,
        font: { size: TitleFontSize, weight: TitleFontWeight },
        padding: { top: 10, bottom: 10 }
      },
     
    // maintainAspectRatio: false,
      datalabels: {
        display: true,
        color: datalabelsColor,        
        font: {
          weight: 'bold',
          size: datalabelsFontSize
        },
        formatter: (value) => value,
      }
    },
    ...options
  }

  // Custom plugin for center text
  const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart) => {
    if (centerText) {
      const { ctx, chartArea: { width, height } } = chart;
      ctx.save();
      // Draw main centerText
      ctx.font = `bold ${centerTextSize}px Arial`;
      ctx.fillStyle = centerTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(centerText, width / 2, height / 1.2, );
      // Draw centerTextLabel below
      if (centerTextLabel) {
        ctx.font = `normal ${centerTextSize * 0.6}px Arial`;
        ctx.fillStyle = centerTextLabelColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(centerTextLabel, width / 2, height / 1.15 + centerTextSize * 0.7);
      }
      ctx.restore();
    }
  }
}

  return (
    <Doughnut
      data={chartData}
      options={defaultOptions}
      plugins={[ChartDataLabels, centerTextPlugin]}
    />
  )
}

export default DoughnutChart
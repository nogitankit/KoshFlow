'use client'
import react from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Component({accounts}: DoughnutChartProps){
  const accountNames = accounts.map((a) => a.name);
  const balances = accounts.map((a) => a.currentBalance);
  
  // Jewel-tone palette: deep indigo → cyan → violet → emerald → rose
  const palette = ['#818cf8', '#22d3ee', '#a78bfa', '#34d399', '#f472b6'];
  const borderPalette = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#ec4899'];
  
  const data = {
    datasets: [
      {
        label: 'Banks',
        data: balances, 
        backgroundColor: palette.slice(0, balances.length),
        borderColor: borderPalette.slice(0, balances.length),
        borderWidth: 2,
        spacing: 4,
        borderRadius: 4,
        hoverOffset: 6,
      }
    ],
    labels: accountNames
  }
  return(
    <Doughnut 
      data={data} 
      options={{
        cutout: '68%',
        plugins:{
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            displayColors: true,
            boxPadding: 4,
          }
        },
        animation: {
          animateRotate: true,
          duration: 1200,
          easing: 'easeOutQuart',
        },
      }}

    />
  )
}
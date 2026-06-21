'use client'
import react from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Component({accounts}: DoughnutChartProps){
  const accountNames = accounts.map((a) => a.name);
  const balances = accounts.map((a) => a.currentBalance);
  const data = {
    datasets: [
      {
        label: 'Banks',
        data: balances, 
        backgroundColor: ['#818cf8', '#22d3ee', '#a78bfa', '#34d399', '#f472b6'],
        borderColor: ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#ec4899'],
        borderWidth: 2,
      }
    ],
    labels: accountNames
  }
  return(
    <Doughnut 
      data={data} 
      options={{
        cutout: '60%',
        plugins:{
          legend: {
            display: false
          }
        }
      }}

    />
  )
}
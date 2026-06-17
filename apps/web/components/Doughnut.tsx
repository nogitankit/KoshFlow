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
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
'use client'
import react from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend);


export default function Component({accounts}: DoughnutChartProps){
  const data = {
    datasets: [
      {
        label: 'Banks',
        data: [1250, 2500, 3750],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
    ],
    labels: ['Bank1', 'Bank2', 'Bank3']
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
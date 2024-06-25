// components/graphs/LineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../../pages/styles/graphs/LineChart.module.css';
import * as d3 from 'd3';

const LineChart = ({ data, title }) => {
  const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
  const formatDate = d3.timeFormat("%d/%m/%Y");

  const daysOfWeek = {
    "Sunday": "Domingo",
    "Monday": "Segunda-feira",
    "Tuesday": "Terça-feira",
    "Wednesday": "Quarta-feira",
    "Thursday": "Quinta-feira",
    "Friday": "Sexta-feira",
    "Saturday": "Sábado"
  };

  const formatDay = (date) => daysOfWeek[d3.timeFormat("%A")(date)];

  const processedData = data.map(d => ({
    ...d,
    data_emissao: parseDate(d.data_emissao),
    total_valor_credito: +d.total_valor_credito
  }));

  const chartData = {
    labels: processedData.map(d => formatDate(d.data_emissao)),
    datasets: [
      {
        label: 'Valor de Crédito (R$)',
        data: processedData.map(d => d.total_valor_credito),
        fill: false,
        borderColor: 'steelblue',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 24,
          family: 'Poppins, Arial, sans-serif',
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const date = processedData[context.dataIndex].data_emissao;
            const value = context.raw.toFixed(2);
            const day = formatDay(date);
            return `${day}, ${formatDate(date)}: R$ ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Data',
          font: {
            size: 14,
            family: 'Poppins, Arial, sans-serif'
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            family: 'Poppins, Arial, sans-serif'
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor de Crédito (R$)',
          font: {
            size: 14,
            family: 'Poppins, Arial, sans-serif'
          }
        }
      }
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chart}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;

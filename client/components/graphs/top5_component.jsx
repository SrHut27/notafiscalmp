import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as d3 from 'd3';
import styles from '../../pages/styles/graphs/Top5.module.css';

const Chart = ({ data }) => {
  const chartRef = useRef(null);

  const processedData = data.filter(d => d.emitente !== null);

  const totalCredito = processedData.reduce((acc, curr) => acc + curr.total_credito, 0);

  const chartData = {
    labels: processedData.map(d => d.emitente),
    datasets: [{
      data: processedData.map(d => d.total_credito),
      backgroundColor: d3.schemeCategory10.slice(0, processedData.length),
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            family: 'Poppins, Arial, sans-serif',
            size: 14,
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            return `${label}: ${value}`;
          }
        }
      },
      datalabels: {
        formatter: (value, context) => {
          const percentage = ((value / totalCredito) * 100).toFixed(2) + '%';
          return percentage;
        },
        color: '#ffffff',
        font: {
          family: 'Poppins, Arial, sans-serif',
          size: 14,
        },
        align: 'center',
        anchor: 'center'
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Os 5 Melhores Emitentes</h2>
      <Pie data={chartData} options={options} ref={chartRef} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default Chart;

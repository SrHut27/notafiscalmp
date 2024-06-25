import React, { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as d3 from 'd3';
import styles from '../../pages/styles/graphs/Top5.module.css';
import axios from 'axios';

const Chart = () => {
    const chartRef = useRef(null);
    const [data, setData] = useState([]);
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [limit, setLimit] = useState(5);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/graph/top-emitentes', {
                params: { mes, ano, limit }
            });
            setData(response.data.resultado);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [mes, ano, limit]);

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

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const anos = Array.from({ length: new Date().getFullYear() - 2009 }, (v, k) => k + 2010);

    const getChartTitle = () => {
        let title = 'Os Melhores Emitentes';
        if (mes) {
            title += ` em ${meses[mes - 1]}`;
        }
        if (ano) {
            title += ` de ${ano}`;
        }
        return title;
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <label>
                    Mês:
                    <select value={mes} onChange={e => setMes(e.target.value)}>
                        <option value="">Todos</option>
                        {meses.map((m, index) => (
                            <option key={index + 1} value={index + 1}>{m}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Ano:
                    <select value={ano} onChange={e => setAno(e.target.value)}>
                        <option value="">Todos</option>
                        {anos.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Número de Emitentes:
                    <select value={limit} onChange={e => setLimit(e.target.value)}>
                        {[5, 6, 7, 8].map(i => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className={styles.chartContainer}>
                <h2 className={styles.chartTitle}>{getChartTitle()}</h2>
                <div className={styles.chartWrapper}>
                    <Pie data={chartData} options={options} ref={chartRef} plugins={[ChartDataLabels]} />
                </div>
            </div>
        </div>
    );
};

export default Chart;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../../pages/styles/graphs/Notas.module.css';

const ColumnChart = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [totalNotas, setTotalNotas] = useState(0);
    const [totalCredito, setTotalCredito] = useState(0);

    const fetchData = async (year, month) => {
        try {
            const response = await axios.get('http://localhost:3001/graph/dados', {
                params: { year, month }
            });

            const data = response.data.resultado;
            const labels = data.map(item => {
                const date = new Date(item.data_emissao || item.mes);
                return year && month ? date.toLocaleDateString('pt-BR') : `${date.getMonth() + 1}/${date.getFullYear()}`;
            });
            const totalNotasArray = data.map(item => item.total_notas);
            const totalCreditoArray = data.map(item => item.total_credito);

            const totalNotasSum = totalNotasArray.reduce((acc, curr) => acc + curr, 0);
            const totalCreditoSum = totalCreditoArray.reduce((acc, curr) => acc + curr, 0);

            setTotalNotas(totalNotasSum);
            setTotalCredito(totalCreditoSum);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Total de Notas',
                        data: totalNotasArray,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    },
                    {
                        label: 'Total de Crédito',
                        data: totalCreditoArray,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    }
                ]
            });
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    useEffect(() => {
        fetchData(year, month);
    }, [year, month]);

    const handleYearChange = (e) => setYear(e.target.value);
    const handleMonthChange = (e) => setMonth(e.target.value);

    const formatCurrency = (value, includeCurrency = true) => {
        if (includeCurrency) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        } else {
            return new Intl.NumberFormat('pt-BR').format(value);
        }
    };
    

    return (
        <div className={styles.dashboard}>
            <div className={styles.controls}>
                <select value={year} onChange={handleYearChange}>
                    <option value="">Selecione o Ano</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                </select>
                <select value={month} onChange={handleMonthChange}>
                    <option value="">Selecione o Mês</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
            </div>
            <div className={styles.chartAndTableContainer}>
                <div className={styles.chartContainer}>
                    <h2>Total de Notas e Crédito</h2>
                    <Bar 
                        data={chartData} 
                        options={{
                            responsive: true,
                            animation: {
                                duration: 2000,
                            },
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            let label = context.dataset.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            const value = context.raw;
                                            if (context.dataset.label === 'Total de Notas') {
                                                return label + formatCurrency(value, false); // No currency symbol for totalNotas
                                            } else {
                                                return label + formatCurrency(value); // With currency symbol for totalCredito
                                            }
                                        }
                                    }
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Data',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Valor',
                                    },
                                    ticks: {
                                        callback: function(value, index, values) {
                                            if (index === 0) {
                                                return formatCurrency(value, false); 
                                            } else {
                                                return formatCurrency(value);
                                            }
                                        }
                                    }
                                },
                            },
                        }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ColumnChart;

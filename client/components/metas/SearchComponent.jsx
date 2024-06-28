import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../../pages/styles/metas/searchMeta.module.css';

const SearchMetaChart = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [lastSuccessfulData, setLastSuccessfulData] = useState({ labels: [], datasets: [] });
    const [error, setError] = useState('');
    const [title, setTitle] = useState('Valores e Metas');

    const fetchData = async (year, month) => {
        try {
            const response = await axios.get('http://localhost:3001/metas/', {
                params: { ano: year, mes: month }
            });

            const metaData = response.data.metas[0];
            const notasData = response.data.notas;

            const newChartData = {
                labels: ['Crédito', 'Meta de Crédito', 'Notas', 'Meta de Notas'],
                datasets: [
                    {
                        label: 'Valor de Crédito',
                        data: [notasData.total_credito, 0, 0, 0],
                        backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        barThickness: 200,
                    },
                    {
                        label: 'Total de Notas',
                        data: [0, 0, notasData.total_notas, 0],
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        barThickness: 200,
                        yAxisID: 'y1',
                    },
                    {
                        label: 'Meta de Crédito',
                        data: [0, metaData.meta_credito, 0, 0],
                        backgroundColor: 'rgba(75, 192, 192, 0.4)',
                        barThickness: 200,
                    },
                    {
                        label: 'Meta de Notas',
                        data: [0, 0, 0, metaData.meta_notas],
                        backgroundColor: 'rgba(255, 99, 132, 0.4)',
                        barThickness: 200,
                        yAxisID: 'y1',
                    }
                ]
            };

            setChartData(newChartData);
            setLastSuccessfulData(newChartData);
            setTitle(`Valores e Metas para ${metaData.mes}/${metaData.ano}`);
            setError('');
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setError('Não foi possível buscar os dados. Tente novamente mais tarde.');
        }
    };

    useEffect(() => {
        fetchData(year, month);
    }, [year, month]);

    useEffect(() => {
        if (!year && !month) {
            fetchData();
        }
    }, []);

    const handleYearChange = (e) => setYear(e.target.value);
    const handleMonthChange = (e) => setMonth(e.target.value);

    const formatCurrency = (value) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
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
            <div className={styles.chartContainer}>
                <h2>{title}</h2>
                <Bar
                    data={error ? lastSuccessfulData : chartData}
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
                                    label: function (context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        const value = context.raw;
                                        return label + (context.dataset.label.includes('Crédito') ? formatCurrency(value) : value);
                                    }
                                },
                            },
                        },
                        scales: {
                            x: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'Categorias',
                                },
                                barPercentage: 0.5,
                                categoryPercentage: 0.5,
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Crédito em R$',
                                },
                                ticks: {
                                    callback: function (value) {
                                        return formatCurrency(value);
                                    },
                                },
                            },
                            y1: {
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Total de Notas',
                                },
                                ticks: {
                                    callback: function (value) {
                                        return Number.isInteger(value) ? value : null;
                                    },
                                },
                                grid: {
                                    drawOnChartArea: false,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default SearchMetaChart;

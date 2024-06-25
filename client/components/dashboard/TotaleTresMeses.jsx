import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from "../../pages/styles/dashboard/TotaletresMeses.module.css";

const Total = () => {
    const [totalNotas, setTotalNotas] = useState(0);
    const [totalCredito, setTotalCredito] = useState(0);
    const [tresMesesDados, setTresMesesDados] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [totalResponse, tresMesesResponse, creditoResponse] = await Promise.all([
                    axios.get('http://localhost:3001/dashboard/todasnotas'),
                    axios.get('http://localhost:3001/dashboard/tresmeses'),
                    axios.get('http://localhost:3001/dashboard/totalcredito')
                ]);
                setTotalNotas(totalResponse.data.resultado[0].total_notas_cadastradas);
                setTresMesesDados(tresMesesResponse.data.resultado);
                setTotalCredito(creditoResponse.data.resultado[0].total_credito);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, []);

    const chartData = {
        labels: tresMesesDados.map(d => `${d.mes}/${d.ano}`),
        datasets: [
            {
                label: 'Total de Crédito',
                data: tresMesesDados.map(d => d.total_credito),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Total de Notas',
                data: tresMesesDados.map(d => d.total_notas),
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Mês/Ano'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Valor'
                }
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                enabled: true
            }
        }
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.chartContainer}>
                <div className={styles.chart}>
                    <h2>Crédito e Notas nos Últimos Seis Meses</h2>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className={styles.totalsContainer}>
                <div className={styles.post_it}>
                    <h2>Total de Notas Cadastradas</h2>
                    <p>{totalNotas}</p>
                </div>
                <div className={styles.post_it}>
                    <h2>Total de Crédito (R$)</h2>
                    <p>{totalCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>
        </div>
    );
};

export default Total;

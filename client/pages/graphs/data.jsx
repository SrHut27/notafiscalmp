// pages/chart.js
import React, { useState, useEffect } from 'react';
import LineChart from '../../components/graphs/data_component';
import { Nav } from '../../components/Nav';
import axios from 'axios';
import styles from '../styles/graphs/LineChart.module.css';
import withAuth from "../../components/auth/WithAuth";

const ChartPage = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [title, setTitle] = useState('Variação de crédito no último mês');

  const fetchData = async (year, month) => {
    try {
      const response = await axios.get('http://localhost:3001/graph/data', {
        params: { year, month }
      });
      setData(response.data.resultado);
      if (year && month) {
        setTitle(`Variação de crédito para ${month}/${year}`);
      } else {
        setTitle('Variação de crédito no último mês');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  useEffect(() => {
    if (year && month) {
      fetchData(year, month);
    }
  }, [year, month]);

  return (
    <>
      <Nav />
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <div className={styles.filterContainer}>
            <label>
              Ano:
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Selecione o ano</option>
                {[...Array(5)].map((_, i) => {
                  const y = 2023 + i;
                  return <option key={y} value={y}>{y}</option>
                })}
              </select>
            </label>
            <label>
              Mês:
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Selecione o mês</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.chartWrapper}>
            <LineChart data={data} title={title} />
          </div>
          <div className={styles.message}>
            Essas informações são automaticamente retiradas da fonte de dados e remetem aos últimos 31 dias e os créditos que esses retornaram.
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get('http://localhost:3001/graph/data');
    const data = response.data.resultado;

    return { props: { initialData: data } };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { initialData: [] },
    };
  }
}

export default withAuth(ChartPage);

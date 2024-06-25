// pages/chart.js
import React from 'react';
import Chart from '../../components/graphs/top5_component';
import { Nav } from '../../components/Nav';
import axios from 'axios';
import withAuth from "../../components/auth/WithAuth";
import styles from '../styles/graphs/Top5.module.css';

const ChartPage = ({ data }) => {
  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <div className={styles.chartContainer}> 
          <div className={styles.chartWrapper}> 
            <Chart data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get('http://localhost:3001/graph/top5');
    const data = response.data.resultado;

    return { props: { data } };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { props: { data: [] } };
  }
}

export default withAuth(ChartPage);

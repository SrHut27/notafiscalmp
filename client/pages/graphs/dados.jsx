// pages/chart.js
import React from 'react';
import ColumnChart from '../../components/graphs/notas_component';
import { Nav } from '../../components/Nav';
import withAuth from "../../components/auth/WithAuth";


const ChartPage = ({ data }) => {
  return (
    <div>
      <Nav />
            <ColumnChart />
    </div>
  );
};


export default withAuth(ChartPage);

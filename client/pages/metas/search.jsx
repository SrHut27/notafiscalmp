// pages/chart.js
import React from 'react';
import { Nav } from '../../components/Nav';
import SearchMetaChart from '../../components/metas/SearchComponent';
import withAuth from "../../components/auth/WithAuth";


const ChartPage = ({ data }) => {
  return (
    <div>
      <Nav />
            <SearchMetaChart />
    </div>
  );
};


export default withAuth(ChartPage);

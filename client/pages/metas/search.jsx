// pages/chart.js
import React from 'react';
import { Nav } from '../../components/Nav';
import SearchMetaChart from '../../components/metas/SearchComponent';
import Link from 'next/link';
import withAuth from "../../components/auth/WithAuth";


const ChartPage = ({ data }) => {
  return (
    <div>
      <Nav />
            <SearchMetaChart />
      <Link href="/metas">
          <p>Voltar</p>
      </Link>
    </div>
  );
};


export default withAuth(ChartPage);

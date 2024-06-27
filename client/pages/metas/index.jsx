// pages/chart.js
import React from 'react';
import { Nav } from '../../components/Nav';
import MetasList from '../../components/metas/ListarMetas';
import withAuth from "../../components/auth/WithAuth";


const IndexPage = ({ data }) => {
  return (
    <div>
      <Nav />
            <MetasList />
    </div>
  );
};


export default withAuth(IndexPage);

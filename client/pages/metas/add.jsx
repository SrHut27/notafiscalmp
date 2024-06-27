// pages/chart.js
import React from 'react';
import { Nav } from '../../components/Nav';
import AdicionarMetaForm from '../../components/metas/AdicionarMetas';
import withAdminAuth from "../../components/auth/WithAuthAdmin"


const AdicionarNotas = ({ data }) => {
  return (
    <div>
      <Nav />
            <AdicionarMetaForm />
    </div>
  );
};


export default withAdminAuth(AdicionarNotas);

// pages/TodasEdicoesPage.jsx
import React from 'react';
import TodasEdicoes from '../../components/edicoes/TodasEdicoes';
import WithAuth from '../../components/auth/WithAuth';
import {Nav} from "../../components/Nav"

const TodasEdicoesPage = () => {
  return (
    <div>
      <Nav />
      <TodasEdicoes />
    </div>
  );
};

export default WithAuth(TodasEdicoesPage);

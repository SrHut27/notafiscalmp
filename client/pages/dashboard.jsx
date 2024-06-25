// pages/dashboard.js
import React from "react";
import { Nav } from "../components/Nav";
import withAuth from "../components/auth/WithAuth";

// módulos do cabeçalhos:
import DashboardTitle from "../components/dashboard/Title"
import CreditoPorMes from "../components/dashboard/CreditoPorMes";
import UltimaEdicao from "../components/dashboard/UltimaEdicao";
import Total from "../components/dashboard/TotaleTresMeses";


function DashboardPage() {
  return (
    <div>
      <DashboardTitle />
      <Nav />
      <CreditoPorMes />
      <Total />
      <UltimaEdicao />
    </div>
  );
}

export default withAuth(DashboardPage);

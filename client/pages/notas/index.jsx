import React from "react";
import SearchNotas from "../../components/notas/consulta";
import { Nav } from "../../components/Nav";
import withAuth from "../../components/auth/WithAuth";

const NotasPages = () => {
  return (
    <div>
      <Nav />
      <SearchNotas />
    </div>
  );
};

export default withAuth(NotasPages);

import React from "react";
import AddNoteComponent from "../../components/notas/addNotas";
import {Nav} from "../../components/Nav";
import withAuth from "../../components/auth/WithAuth";

function AddNotasPage() {
   return (
    <div>
        <Nav />
        <AddNoteComponent />
    </div>
   )
}

export default withAuth(AddNotasPage);
import React from "react";
import AddNoteComponent from "../../components/notas/addNotas";
import {Nav} from "../../components/Nav";
import withAdminAuth from "../../components/auth/WithAuthAdmin"

function AddNotasPage() {
   return (
    <div>
        <Nav />
        <AddNoteComponent />
    </div>
   )
}

export default withAdminAuth(AddNotasPage);
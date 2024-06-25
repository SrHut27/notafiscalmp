// pages/login.js
import Head from 'next/head';
import Login from '../../components/auth/Register';
import withAdminAuth from "../../components/auth/WithAuthAdmin"

const LoginPage = () => {
  return (
    <div>
      <Head>
        <title>Cadastrar usuários</title>
      </Head>
      <Login />
    </div>
  );
};

export default withAdminAuth(LoginPage);
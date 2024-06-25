// pages/login.js
import Head from 'next/head';
import Login from '../../components/auth/Register';

const LoginPage = () => {
  return (
    <div>
      <Head>
        <title>Cadastro</title>
      </Head>
      <Login />
    </div>
  );
};

export default LoginPage;
// pages/login.js
import Head from 'next/head';
import Login from '../../components/auth/Login';

const LoginPage = () => {
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <Login />
    </div>
  );
};

export default LoginPage;
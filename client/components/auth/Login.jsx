import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../pages/styles/auth/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [firstPass, setFirstPass] = useState(false); // Novo estado para indicar se é a primeira senha
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password, novaSenha, confirmarSenha });
      const { token, user, firstPass: firstLogin } = response.data;
      
      if (firstLogin) {
        setFirstPass(true); // Define o estado de primeira senha
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userNAME', `${user.name} ${user.last_name}`);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Acessar sistema</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={styles.input}
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={styles.input}
            required 
          />
        </div>
        
        {firstPass && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nova Senha:</label>
              <input 
                type="password" 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)} 
                className={styles.input}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirmar Nova Senha:</label>
              <input 
                type="password" 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)} 
                className={styles.input}
                required 
              />
            </div>
          </>
        )}
        
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.registerLink}>
        Não tem uma conta? <Link href="/auth/register">Cadastre-se aqui</Link>
      </p>

      <p className={styles.registerLink}>
        Esqueceu sua senha? <Link href="/auth/forgot-password">Recupere aqui</Link>
      </p>

      <button className={styles.homeButton} onClick={() => router.push('/')}>Página inicial</button>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../pages/styles/auth/Register.module.css';

const Register = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [admin, setAdmin] = useState(false); // Novo estado para administrador
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/auth/login');
    return;
  }
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/register', { name, lastName, email, admin });
      router.push('/auth/login');
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastrar novo usuário</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className={styles.input}
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Sobrenome:</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            className={styles.input}
            required 
          />
        </div>
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
          <label className={styles.label}>
            <input 
              type="checkbox" 
              checked={admin} 
              onChange={(e) => setAdmin(e.target.checked)} 
            />
            {' '}É Administrador
          </label>
        </div>
        <button type="submit" className={styles.button}>Cadastrar</button>
      </form>
      <p className={styles.loginLink}>
        Deseja retornar? <Link href="/dashboard">Volte a Dashboard!</Link>
      </p>
      <button className={styles.homeButton} onClick={() => router.push('/')}>Página inicial</button>
    </div>
  );
};

export default Register;

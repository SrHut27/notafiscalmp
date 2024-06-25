import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/auth/ForgotPassword.module.css';
import Link from 'next/link';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/auth/forgot-password', { email });
      setMessage(response.data.resultado);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recuperar Senha</h2>
      <p>Informe seu email de cadastro para recuperar sua senha.</p>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        <button type="submit" className={styles.button}>Enviar</button>
      </form>
      {message && <p className={styles.error}>{message}</p>}

      <p className={styles.registerLink}>
        <Link href="/auth/login">Voltar</Link>
      </p>

    </div>

    
  );
};

export default ForgotPassword;

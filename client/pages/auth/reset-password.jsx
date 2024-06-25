import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/auth/ForgotPassword.module.css';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3001/auth/reset-password/${token}`, { password, confirmPassword });
      setMessage(response.data.resultado);
      router.push('/auth/login');  
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className={styles.container}>
    <h2 className={styles.title}> Redefinir Senha</h2>
      <form className={styles.form}  onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
            <label className={styles.label}>Nova senha:</label>
            <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Confirmar nova senha:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Redefinir senha</button>
      </form>
      {message && <p className={styles.error}>{message}</p>}
    </div>
  );
};

export default ResetPassword;

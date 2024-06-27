import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../pages/styles/metas/adicionarMetas.module.css';

const AdicionarMetaForm = () => {
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [valorCredito, setValorCredito] = useState('');
  const [valorNota, setValorNota] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mes || !ano || !valorCredito || !valorNota) {
      setError('Se deseja inserir uma meta, informe todos os dados necessários');
      setSuccess('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/metas/add', {
        mes,
        ano,
        valorCredito,
        valorNota,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.resultado) {
        setSuccess(response.data.resultado);
        setError('');
        // Limpa os campos após o envio bem-sucedido
        setMes('');
        setAno('');
        setValorCredito('');
        setValorNota('');
      } else if (response.data.error) {
        setError(response.data.error);
        setSuccess('');
      }
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      setError('Erro ao adicionar meta. Tente novamente mais tarde.');
      setSuccess('');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Adicionar Meta</h2>
      {error && <p className={`${styles.error} ${styles.message} ${styles.show}`}>{error}</p>}
      {success && <p className={`${styles.success} ${styles.message} ${styles.show}`}>{success}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mês:</label>
          <input
            type="text"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Ano:</label>
          <input
            type="text"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Valor Crédito:</label>
          <input
            type="text"
            value={valorCredito}
            onChange={(e) => setValorCredito(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Valor Nota:</label>
          <input
            type="text"
            value={valorNota}
            onChange={(e) => setValorNota(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Adicionar</button>
      </form>
    </div>
  );
};

export default AdicionarMetaForm;

import React, { useState } from 'react';
import styles from '../../pages/styles/dashboard/CreditoPorMes.module.css';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('body');

const SearchFormWithModal = () => {
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [valorTotalNotas, setValorTotalNotas] = useState(null);
  const [totalNotasCadastradas, setTotalNotasCadastradas] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValorTotalNotas(null);
    setTotalNotasCadastradas(null);

    try {
      const response = await axios.post('http://localhost:3001/dashboard/valor', { mes, ano });
      const { resultado } = response.data;
      setValorTotalNotas(resultado.valor_total_notas);
      setTotalNotasCadastradas(resultado.total_notas_cadastradas);
      setIsModalOpen(true); 
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar dados');
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className={styles.searchFormWithModal}>
      <h2>Valor de crédito e total de notas doadas por período:</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="mes">Mês:</label>
          <select
            id="mes"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            required
          >
            <option value="">Selecione o mês</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="ano">Ano:</label>
          <select
            id="ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            required
          >
            <option value="">Selecione o ano</option>
            {[...Array(new Date().getFullYear() - 2023 + 1)].map((_, i) => (
              <option key={i + 2023} value={i + 2023}>
                {i + 2023}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.button} type="submit">Buscar</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}>X</button>
        {valorTotalNotas !== null && (
          <div className={styles.modalContent}>
            <h3>Resultados da Pesquisa:</h3>
            <p>Total de crédito: {formatCurrency(valorTotalNotas)}</p>
            <p>Total de notas doadas: {totalNotasCadastradas}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SearchFormWithModal;

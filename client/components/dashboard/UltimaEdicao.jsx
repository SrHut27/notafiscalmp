import React, { useState, useEffect } from 'react';
import styles from '../../pages/styles/dashboard/UltimaEdicao.module.css';
import axios from 'axios';
import Link from 'next/link';

const LastEditInfo = () => {
  const [ultimaEdicao, setUltimaEdicao] = useState(null);
  const [error, setError] = useState('');

  const getEstadoTextoCor = (estado) => {
    switch (estado) {
      case 'adicao':
        return { texto: 'Adição de notas', cor: styles.adicao };
      case 'edicao':
        return { texto: 'Edição de notas', cor: styles.edicao };
      case 'exclusao':
        return { texto: 'Exclusão de notas', cor: styles.exclusao };
      default:
        return { texto: estado, cor: styles.default };
    }
  };

  useEffect(() => {
    const fetchUltimaEdicao = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dashboard/ultimaedicao');
        setUltimaEdicao(response.data.resultado[0]);
      } catch (err) {
        console.log(err);
        setError('Erro ao buscar última edição');
      }
    };

    fetchUltimaEdicao();
  }, []);

  return (
    <div className={`${styles.results} ${styles.ultimaEdicao}`}>
      <h3>Última alteração nas notas registradas:</h3>
      {error && <p className={styles.error}>{error}</p>}
      {ultimaEdicao && (
        <>
          <p>Administrador: {ultimaEdicao.administrador}</p>
          <p>
            Estado: <span className={getEstadoTextoCor(ultimaEdicao.estado).cor}>
              {getEstadoTextoCor(ultimaEdicao.estado).texto}
            </span>
          </p>
          <p>Quantia: {ultimaEdicao.quantidade}</p>
          <p>Data: {new Date(ultimaEdicao.data).toLocaleString('pt-BR')}</p>
        </>
      )}
      <Link href="/dashboard/log">
        <p>Ver todas edições</p>
      </Link>
    </div>
  );
};

export default LastEditInfo;

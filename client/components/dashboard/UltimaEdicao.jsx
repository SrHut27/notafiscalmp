import React, { useState, useEffect } from 'react';
import styles from '../../pages/styles/dashboard/UltimaEdicao.module.css';
import axios from 'axios';
import Link from 'next/link';

const DashboardInfo = () => {
  const [ultimaEdicao, setUltimaEdicao] = useState(null);
  const [ultimaMeta, setUltimaMeta] = useState(null);
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

    const fetchUltimaMeta = async () => {
      try {
        const response = await axios.get('http://localhost:3001/metas/ultima');
        setUltimaMeta(response.data);
      } catch (err) {
        console.log(err);
        setError('Erro ao buscar última meta');
      }
    };

    fetchUltimaEdicao();
    fetchUltimaMeta();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.section}>
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

      <div className={styles.separator}></div>

      <div className={styles.section}>
        <h3>Última meta adicionada:</h3>
        {error && <p className={styles.error}>{error}</p>}
        {ultimaMeta && (
          <>
            <p>Administrador: {ultimaMeta.administrador}</p>
            <p>Para a data: {ultimaMeta.mes}/{ultimaMeta.ano}</p>
            <p>Meta de Crédito: R$ {ultimaMeta.meta_credito.toFixed(2)}</p>
            <p>Meta de Notas: {ultimaMeta.meta_notas}</p>
            <Link href="/metas">
            <p>Ver todas metas</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardInfo;

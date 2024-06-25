import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../pages/styles/dashboard/TodasEdicoes.module.css';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa'; // Import the user icon

const EdicoesComponent = () => {
  const [edicoes, setEdicoes] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get the user name from localStorage
    const storedUserName = localStorage.getItem('userNAME');
    setUserName(storedUserName);

    const fetchEdicoes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dashboard/todasedicoes');
        setEdicoes(response.data.resultado);
      } catch (error) {
        console.error('Erro ao buscar edições:', error);
      }
    };

    fetchEdicoes();
  }, []);

  const getOperacaoLabel = (estado) => {
    switch (estado) {
      case 'adicao':
        return { label: 'Adição de notas', color: 'green' };
      case 'exclusao':
        return { label: 'Exclusão de notas', color: 'red' };
      case 'edicao':
        return { label: 'Edição de notas', color: 'yellow' };
      default:
        return { label: 'Operação desconhecida', color: 'black' };
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Log das edições:</h1>
      <div className={styles.cardContainer}>
        {edicoes.map(edicao => (
          <div key={edicao.id} className={styles.card} style={{ borderColor: getOperacaoLabel(edicao.estado).color }}>
            <h3>
              {edicao.administrador}
              {edicao.administrador === userName && <FaUser className={styles.userIcon} />}
            </h3>
            <p><strong>Operação:</strong> <span style={{ color: getOperacaoLabel(edicao.estado).color }}>{getOperacaoLabel(edicao.estado).label}</span></p>
            <p><strong>Quantidade:</strong> {edicao.quantidade}</p>
            <p><strong>Data e Hora:</strong> {new Date(edicao.data).toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>
      <div className={styles.backLink}>
        <Link href="/dashboard">
          <p>Voltar para Dashboard</p>
        </Link>
      </div>
    </div>
  );
};

export default EdicoesComponent;

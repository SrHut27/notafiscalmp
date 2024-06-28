import React from 'react';
import { useRouter } from 'next/router';
import { Nav } from '../../components/Nav';
import styles from '../styles/graphs/GraphsIndexPages.module.css';
import withAuth from "../../components/auth/WithAuth";

function GraphsIndexPages() {
  const router = useRouter();

  const handleCardClickGraph1 = () => {
    router.push('/graphs/top5');
  };

  const handleCardClickGraph2 = () => {
    router.push('/graphs/data');
  };
  
  const handleCardClickGraph3 = () => {
    router.push('/graphs/dados');
  };


  return (
    <div>
      <Nav />
      <div className={styles.content}>
        <div className={styles.card} onClick={handleCardClickGraph1}>
          <h2>Top 5 Emitentes</h2>
          <p>Consulte um gráfico de setores com os 5 emitentes que mais retornam crédito para a Escola Maria Peregrina</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.card} onClick={handleCardClickGraph2}>
          <h2>Crédito x Dia</h2>
          <p>Consulte um gráfico de pontos que mostra o retorno de crédito dos 31 últimos dias registrados no sistema.</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.card} onClick={handleCardClickGraph3}>
          <h2>Total de notas e crédito</h2>
          <p>Consulte qual foi o retorno de determinado mês.</p>
        </div>
      </div>
    </div>
    
  );
}

export default withAuth(GraphsIndexPages);

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../pages/styles/metas/listarMetas.module.css';

const MetasList = () => {
  const [metas, setMetas] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/metas/todas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMetas(response.data);
      } catch (err) {
        console.log(err);
        setError('Erro ao buscar metas');
      }
    };

    const checkAdmin = () => {
      const admin = localStorage.getItem('admin') === 'true';
      setIsAdmin(admin);
    };

    fetchMetas();
    checkAdmin();
  }, []);

  const confirmDeleteMeta = (metaID) => {
    setMetaToDelete(metaID);
    setShowModal(true);
  };

  const deleteMeta = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3001/metas/delete/${metaToDelete}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMetas(metas.filter((meta) => meta.id !== metaToDelete));
      setShowModal(false);
      setMetaToDelete(null);
    } catch (err) {
      console.log(err);
      setError('Erro ao apagar a meta');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMetaToDelete(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Metas</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.metaList}>
        {metas.map((meta) => (
          <div key={meta.id} className={styles.metaCard}>
            <p>Mês/Ano: {meta.mes}/{meta.ano}</p>
            <p>Meta de Crédito: R$ {meta.meta_credito.toFixed(2)}</p>
            <p>Meta de Notas: {meta.meta_notas}</p>
            <p>Administrador: {meta.administrador}</p>
            <p>Data de Cadastro: {new Date(meta.data_cadastro).toLocaleString('pt-BR')}</p>
            {isAdmin && (
              <button onClick={() => confirmDeleteMeta(meta.id)} className={styles.deleteButton}>Apagar</button>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Tem certeza que deseja apagar esta meta?</p>
            <button onClick={deleteMeta} className={styles.confirmButton}>Sim</button>
            <button onClick={closeModal} className={styles.cancelButton}>Não</button>
          </div>
        </div>
      )}
      <div className={styles.fixedButtons}>
        <button onClick={() => router.push('/metas/search')} className={styles.fixedButton}>Gráfico de Metas</button>
        <button onClick={() => router.push('/dashboard')} className={styles.fixedButtonGrey}>Voltar ao Dashboard</button>
      </div>
      {isAdmin && (
        <div className={styles.adminButtons}>
          <button onClick={() => router.push('/metas/add')} className={styles.addButton}>Adicionar Meta</button>
        </div>
      )}
    </div>
  );
};

export default MetasList;

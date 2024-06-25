import React, { useState } from "react";
import axios from "axios";
import styles from "../../pages/styles/notas/SearchNotas.module.css";
import ConfirmModal from "../_modals/ConfirmModal";
import {useRouter} from "next/router"

const SearchNotas = () => {
  const [valor, setValor] = useState("");
  const [valorMenor, setValorMenor] = useState("");
  const [emitente, setEmitente] = useState("");
  const [valorCredito, setValorCredito] = useState("");
  const [valorCreditoMenor, setValorCreditoMenor] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [notaToDelete, setNotaToDelete] = useState(null); 

  const router = useRouter();

  // Função para buscar notas
  const handleSearch = async () => {
    const params = {};
    if (!isNaN(valor) && valor !== "") params.valor = valor;
    if (!isNaN(valorMenor) && valorMenor !== "") params.valorMenor = valorMenor;
    if (emitente) params.emitente = emitente;
    if (!isNaN(valorCredito) && valorCredito !== "") params.valorCredito = valorCredito;
    if (!isNaN(valorCreditoMenor) && valorCreditoMenor !== "") params.valorCreditoMenor = valorCreditoMenor;

    try {
      const response = await axios.get("http://localhost:3001/file/search", { params });
      const formattedResults = response.data.resultado.map(nota => ({
        ...nota,
        data_emissao: new Date(nota.data_emissao).toLocaleDateString(),
        data_registro: new Date(nota.data_registro).toLocaleDateString()
      }));
      setResultados(formattedResults);
      setError("");
      setMostrarFormulario(false);
    } catch (err) {
      setResultados([]);
      setError(err.response?.data?.error || "Erro ao buscar notas");
    }
  };

  // Função para deletar nota
  const handleDelete = async () => {
    if (!notaToDelete) return;
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.post(`http://localhost:3001/file/delete/${notaToDelete}`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
  
      setResultados(resultados.filter(nota => nota.id !== notaToDelete));
      setShowConfirmModal(false);
      setNotaToDelete(null);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        setError("Sua sessão expirou. Redirecionando para o login...");
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userNAME');
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(err.response?.data?.error || "Erro ao deletar nota");
      }
    }
  };

  // Função para abrir o modal de confirmação
  const confirmDelete = (notaID) => {
    setNotaToDelete(notaID);
    setShowConfirmModal(true);
  };

  // Função para limpar resultados da busca
  const handleClearResults = () => {
    setResultados([]);
    setMostrarFormulario(true);
  };

  return (
    <div className={styles.container}>
      {mostrarFormulario && (
        <>
          <h1 className={styles.heading}>Pesquisar Notas</h1>

          <div className={styles.inputContainer}>
            <h4>Buscar por Emitente</h4>
            <input
              type="text"
              placeholder="Emitente"
              value={emitente}
              onChange={(e) => setEmitente(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputContainer}>
            <h4>Buscar por Valor (maior ou igual)</h4>
            <input
              type="text"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputContainer}>
            <h4>Buscar por Valor (menor)</h4>
            <input
              type="text"
              placeholder="Valor"
              value={valorMenor}
              onChange={(e) => setValorMenor(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputContainer}>
            <h4>Buscar por Valor do Crédito (maior ou igual)</h4>
            <input
              type="text"
              placeholder="Valor do Crédito"
              value={valorCredito}
              onChange={(e) => setValorCredito(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputContainer}>
            <h4>Buscar por Valor do Crédito (menor)</h4>
            <input
              type="text"
              placeholder="Valor do Crédito"
              value={valorCreditoMenor}
              onChange={(e) => setValorCreditoMenor(e.target.value)}
              className={styles.input}
            />
          </div>

          <button onClick={handleSearch} className={styles.button}>Buscar</button>
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {resultados.length > 0 && (
        <div className={styles.resultsContainer}>
          <h2 className={styles.resultsHeading}>Resultados</h2>
          <ul className={styles.resultsList}>
            {resultados.map(nota => (
              <li key={nota.id} className={styles.resultItem}>
                <strong>CNPJ:</strong> {nota.cnpj} <br />
                <strong>Emitente:</strong> {nota.emitente} <br />
                <strong>Numeracao:</strong> {nota.numeracao} <br />
                <strong>Data de Emissão:</strong> {nota.data_emissao} <br />
                <strong>Valor da Nota:</strong> R$ {nota.valor_nota} <br />
                <strong>Data de Registro:</strong> {nota.data_registro} <br />
                <strong>Crédito:</strong> R$ {nota.valor_credito} <br />
                <button
                  onClick={() => confirmDelete(nota.id)}
                  className={styles.deleteButton}
                >
                  Apagar Nota
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleClearResults} className={`${styles.clearButton} ${styles.fixedButton}`}>
            Limpar Resultados
          </button>
        </div>
      )}

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default SearchNotas;

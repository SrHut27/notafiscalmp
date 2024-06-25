import React, { useState } from 'react';
import axios from 'axios';
import styles from "../../pages/styles/notas/AddNotas.module.css"

const AddNoteComponent = () => {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        // Limpa as mensagens de erro e sucesso
        setErrorMessage('');
        setSuccessMessage('');

        if (!file) {
            setErrorMessage('Por favor, selecione um arquivo para enviar.');
            return;
        }

        setLoading(true); // Ativando animação de carregamento

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');
            if (!token) {
                 window.location.href = "/"

            }

            const response = await axios.post('http://localhost:3001/file/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log(response.data);

            if (response.data && response.data.resultado) {
                setSuccessMessage(response.data.resultado + ` Você será redirecionado para a dashboard...`);
                setTimeout(() => {
                    window.location.href = "/dashboard"
                }, 3000)
            }
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Seu acesso expirou. Você será redirecionado para a página de login...");
                setTimeout(() => {
                    window.location.href = "/auth/login";
                }, 3000);
            } else if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Ocorreu um erro ao enviar o arquivo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Adicionar Notas</h2>
            <input type="file" onChange={handleFileChange} className={styles.fileInput} accept='.xlsx' />
            <button onClick={handleSubmit} className={styles.button}>Adicionar</button>
            {loading && (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingMessage}>Dados sendo tratados no momento...</div>
                    <div className={styles.spinner}></div>
                </div>
            )}
            <br />
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            {successMessage && <div className={styles.success}>{successMessage}</div>}
        </div>
    );
};

export default AddNoteComponent;

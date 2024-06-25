import React from "react";
import styles from "../styles/auth/ComoAcessar.module.css";
import { AiOutlineMail, AiOutlineHome } from "react-icons/ai";
import { FaTachometerAlt } from 'react-icons/fa';
import { useRouter } from "next/router";

const AccessNotaFiscal = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Como acessar o sistema Nota Fiscal Paulista</h1>
      <div className={styles.step}>
        <div className={styles.stepIcon}>
          <AiOutlineMail size={32} />
        </div>
        <div className={styles.stepText}>
          <p>
            Para acessar o sistema Nota Fiscal Paulista, envie um email para{" "}
            <a href="mailto:servicomp@mariaperegrina.org">servicomp@mariaperegrina.org</a>.
            Justifique sua adesão ao sistema.
          </p>
        </div>
      </div>
      <div className={styles.step}>
        <div className={styles.stepIcon}>
          <AiOutlineHome size={32} />
        </div>
        <div className={styles.stepText}>
          <p>
            Após enviar o email, você receberá as instruções necessárias para acessar o sistema.
          </p>
        </div>
      </div>
      <div className={styles.goBack}>
        <button className={styles.button} onClick={handleGoBack}>
          <FaTachometerAlt size={20} />
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
};

export default AccessNotaFiscal;

import React from "react";
import styles from "../styles/GlobalStyles.module.css";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
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
          <EmailIcon fontSize="large" />
        </div>
        <div className={styles.stepText}>
          <p>
            Para acessar o sistema Nota Fiscal Paulista, envie um email para{" "}
            <a href="mailto:servicomp@mariaperegrina.org">servicomp@mariaperegrina.org</a>.
          </p>
        </div>
      </div>
      <div className={styles.step}>
        <div className={styles.stepIcon}>
          <HomeIcon fontSize="large" />
        </div>
        <div className={styles.stepText}>
          <p>
            Após enviar o email, você receberá as instruções necessárias para acessar o sistema.
          </p>
        </div>
      </div>
      <div className={styles.goBack}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={handleGoBack}
        >
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default AccessNotaFiscal;

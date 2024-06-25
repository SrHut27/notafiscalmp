import React from "react";
import styles from "../../pages/styles/notas/ConfirmModal.module.css";

const ConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Confirmar Ação</h2>
        <p className={styles.modalMessage}>Tem certeza que deseja apagar esta nota?</p>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.confirmButton}>Sim</button>
          <button onClick={onClose} className={styles.cancelButton}>Não</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

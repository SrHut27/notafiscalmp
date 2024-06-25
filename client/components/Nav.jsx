import React, { useState, useEffect } from 'react';
import styles from '../pages/styles/NavStyle.module.css';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Nav = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);  // Estado para armazenar se o usuário é admin
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('userNAME');
    const adminStatus = localStorage.getItem('admin');  // Busca se o usuário é admin no localStorage
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.get('http://localhost:3001/auth/logout', config);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userNAME');
      localStorage.removeItem('admin');  
      router.push('/');
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-logo"]}>
        <Image src="/images/logo.webp" width={80} height={70} alt="Logo" />
      </div>
      <div className={styles["navbar-title"]}>
        <Link href="/dashboard" className={styles["navbar-link"]}>Sistema Nota Fiscal Paulista</Link>
      </div>
      <div className={styles["navbar-links"]}>
        <Link href="/notas" className={styles["navbar-link"]}>Consultar notas</Link>
        {isAdmin && (  // Renderiza "Adicionar nota" apenas se o usuário for admin
        <Link href="/notas/add" className={styles["navbar-link"]}>Adicionar nota</Link>
       )}
        <div 
          className={styles.dropdown} 
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link href="/graphs" className={styles["navbar-link"]}>Gráficos</Link>
          {showDropdown && (
            <div className={styles["dropdown-content"]}>
              <Link href="/graphs/top5" className={styles["dropdown-link"]}>Melhores retorno de crédito</Link>
              <Link href="/graphs/data" className={styles["dropdown-link"]}>Crédito relação dia</Link>
              <Link href="/graphs/dados" className={styles["dropdown-link"]}>Cupons x Crédito</Link>
            </div>
          )}
        </div>
      </div>
        {isAdmin && (  
        <Link href="/auth/register" className={styles["navbar-link"]}>Adicionar Usuário</Link>
       )}
      <div 
        className={styles["user-info"]}
        onMouseEnter={() => setShowLogout(true)} 
        onMouseLeave={() => setShowLogout(false)}
      >
        <span className={styles.username}>{username}</span>
        {showLogout && (
          <button className={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        )}
      </div>
    </nav>
  );
};

export { Nav };
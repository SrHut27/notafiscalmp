import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles/GlobalStyles.module.css";

function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Usuário está logado, redirecionar para a página de dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao verificar login:", error);
        // Tratar erros de verificação, se necessário
      }
    };

    checkLoggedIn();
  }, [router]);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <header className={styles.header}>
          <nav className={styles.navbar}>
            <div className={styles.logo}>
              <img src="/images/logo.webp" alt="Logo" />
            </div>
            <div className={styles.navLinks}>
              <Link href="/auth/login">
                <p className={styles.navLink}>Acessar</p>
              </Link>
              <Link href="/auth/register">
                <p className={styles.navLink}>Como acessar?</p>
              </Link>
            </div>
          </nav>
        </header>
        <section className={styles.hero}>
          <div className={styles.heroImage}>
            <img src="/images/banner.webp" alt="Banner" />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>Sistema Nota Fiscal MP</h1>
              <p>
                Cadastre e consulte notas para construir uma relação bem estruturada dos créditos obtidos com a doação de cupons fiscais para as Missões Maria Peregrina.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/auth/login">
                  <p className={styles.loginButton}>Acessar</p>
                </Link>
                <Link href="/auth/como_acessar">
                  <p className={styles.registerButton}>Como acessar?</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.content}>
          <div className={styles.contentSection}>
            <div className={styles.contentText}>
              <h2>Qual a função do Sistema Nota Fiscal MP?</h2>
              <p>
                Como conhecimento de todos, a doação de notas fiscais é um dos maiores (se não o maior) recurso financeiro para a manutenção e expansão da Escola Maria Peregrina. Portanto, esse sistema foi construído com o objetivo de consultar, montar estratégias e melhorar sempre esse processo; essencial para a educação de centenas de crianças em São José do Rio Preto/SP e Rio Claro/SP.
              </p>
            </div>
            <div className={styles.contentImage}>
              <img src="/images/backdrop_comp.webp" alt="Recursos" />
            </div>
          </div>
          <div className={styles.contentTitle}>
          <h2 className={styles.contentTitle}>Como usar?</h2>
          </div>
          <div className={styles.iconCollection}>
            <div className={styles.iconItem}>
              <img src="/icons/pen-icon.svg" alt="Caneta" />
              <p>Registre suas notas fiscais, através da planilha (EXCEL ou CSV) que o governo realiza.</p>
            </div>
            <div className={styles.iconItem}>
              <img src="/icons/paper-icon.svg" alt="Papel" />
              <p>Acompanhe seus créditos, emitentes, datas de registro e melhores retornos.</p>
            </div>
            <div className={styles.iconItem}>
              <img src="/icons/happy-icon.svg" alt="Joia" />
              <p>Obtenha insights valiosos sobre as doações de cupons fiscais para sua instituição!</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default IndexPage;

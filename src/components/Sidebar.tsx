import React from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  setActiveView: (view: string) => void;
}

function Sidebar({ setActiveView }: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src="crypto.png" className={styles.logo} alt="logo" />
        <p>Crypto App</p>
      </div>
      <nav className={styles.nav}>
        <button className={styles.navButton} onClick={() => setActiveView('caesar')}>Szyfr Cezara</button>
        <button className={styles.navButton} onClick={() => setActiveView('matrix')}>Szyfr macierzowy</button>
        <button className={styles.navButton} onClick={() => setActiveView('vigenere')}>Szyfr Vigenere'a</button>
        <button className={styles.navButton} onClick={() => setActiveView('des')}>Szyfrowanie DES</button>
        <button className={styles.navButton} onClick={() => setActiveView('aes')}>Szyfrowanie AES</button>
        <button className={styles.navButton} onClick={() => setActiveView('dh')}>Protokół Diffiego-Hellmana</button>
        <button className={styles.navButton} onClick={() => setActiveView('rsa')}>Szyfrowanie RSA</button>
        <button className={styles.navButton} onClick={() => setActiveView('aestream')}>Symulacja strumieniowego środowiska</button>
        <button className={styles.navButton} onClick={() => setActiveView('certs')}>Analiza certyfikatów</button>
        <button className={styles.navButton} onClick={() => setActiveView('sign')}>Podpisy cyfrowe</button>
        <button className={styles.navButton} onClick={() => setActiveView('hmac')}>Szyfrowanie HMAC</button>
        <button className={styles.navButton} onClick={() => setActiveView('hh')}>Kodowanie Huffmana i Hamminga</button>
      </nav>
    </div>
  );
}

export default Sidebar;
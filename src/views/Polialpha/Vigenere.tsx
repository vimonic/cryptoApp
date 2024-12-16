// src/components/VigenereCipher.tsx
import React, { useState } from 'react';
import styles from './Vigenere.module.css';

const Vigenere: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [key, setKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const encryptVigenere = (text: string, key: string): string => {
    const upperText = text.toUpperCase(); 
    const upperKey = key.toUpperCase(); 
    let encrypted = ''; 

    for (let i = 0, j = 0; i < upperText.length; i++) {
      const charCode = upperText.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) { 
        const shift = upperKey.charCodeAt(j % upperKey.length) - 65; 
        encrypted += String.fromCharCode(((charCode - 65 + shift) % 26) + 65); 
        j++; 
      } else {
        encrypted += upperText[i];
      }
    }

    return encrypted;
  };

  const decryptVigenere = (text: string, key: string): string => {
    const upperText = text.toUpperCase();
    const upperKey = key.toUpperCase(); 
    let decrypted = ''; 

    for (let i = 0, j = 0; i < upperText.length; i++) {
      const charCode = upperText.charCodeAt(i); 
      if (charCode >= 65 && charCode <= 90) { 
        const shift = upperKey.charCodeAt(j % upperKey.length) - 65; 
        decrypted += String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65); 
        j++;
      } else {
        decrypted += upperText[i];
      }
    }

    return decrypted;
  };

  const handleEncrypt = () => {
    setEncryptedText(encryptVigenere(plainText, key));
  };

  const handleDecrypt = () => {
    setDecryptedText(decryptVigenere(encryptedText, key));
  };

  return (
    <div className={styles.container}>
      <h2>Szyfr Vigenère</h2>
      <label>Tekst jawny:</label>
      <textarea
        value={plainText}
        onChange={(e) => setPlainText(e.target.value)}
        className={styles.textArea}
      />
      <label>Klucz:</label>
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className={styles.input}
      />
      <div className={styles.buttons}>
        <button onClick={handleEncrypt} className={styles.button}>Zaszyfruj</button>
        <button onClick={handleDecrypt} className={styles.button}>Odszyfruj</button>
      </div>
      <label>Szyfrogram:</label>
      <textarea
        value={encryptedText}
        readOnly
        className={styles.textArea}
      />
      <label>Odszyfrowany tekst:</label>
      <textarea
        value={decryptedText}
        readOnly
        className={styles.textArea}
      />
    </div>
  );
};

export default Vigenere;
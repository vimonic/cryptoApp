import React, { useState } from 'react';
import styles from './Vigenere.module.css';

const Vigenere: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [key, setKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const validateKey = (key: string): void => {
    if (!/^[a-zA-Z]+$/.test(key)) {
      alert("Klucz może zawierać tylko litery alfabetu (A-Z, a-z).");
    }
  };

  const encryptVigenere = (text: string, key: string): string => {
  validateKey(key);
  const cleanedKey = key.toUpperCase();
  let encrypted = "";
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charCode = char.toUpperCase().charCodeAt(0);

    if (charCode >= 65 && charCode <= 90) {
      const shift = cleanedKey.charCodeAt(keyIndex % cleanedKey.length) - 65;
      const newChar = String.fromCharCode(((charCode - 65 + shift) % 26) + 65);

      encrypted += char === char.toUpperCase() ? newChar : newChar.toLowerCase();
      keyIndex++;
    } else {
      encrypted += char;
    }
  }

  return encrypted;
  };
  
  const decryptVigenere = (text: string, key: string): string => {
    validateKey(key);
    const cleanedKey = key.toUpperCase();
    let decrypted = "";
    let keyIndex = 0;
  
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charCode = char.toUpperCase().charCodeAt(0);
  
      if (charCode >= 65 && charCode <= 90) {
        const shift = cleanedKey.charCodeAt(keyIndex % cleanedKey.length) - 65;
        const newChar = String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65);
  
        decrypted += char === char.toUpperCase() ? newChar : newChar.toLowerCase();
        keyIndex++;
      } else {
        decrypted += char;
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
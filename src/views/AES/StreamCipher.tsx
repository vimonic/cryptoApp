import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import styles from './StreamCipher.module.css';

const AESStream: React.FC = () => {
  const [text, setText] = useState('');
  const [key, setKey] = useState('mocny_klucz12345');
  const [cipherText, setCipherText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const encryptText = (inputText: string, inputKey: string) => {
    if (inputKey) {
      const encrypted = CryptoJS.AES.encrypt(inputText, inputKey).toString();
      return encrypted;
    }
    return '';
  };

  const decryptText = (encryptedText: string, inputKey: string) => {
    if (encryptedText && inputKey) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, inputKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText || 'Nieprawidłowy klucz!';
      } catch {
        return 'Nieprawidłowy klucz!';
      }
    }
    return '';
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setText(inputText);

    const encrypted = encryptText(inputText, key);
    setCipherText(encrypted);

    const decrypted = decryptText(encrypted, key);
    setDecryptedText(decrypted);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputKey = e.target.value;
    setKey(inputKey);

    const encrypted = encryptText(text, inputKey);
    setCipherText(encrypted);

    const decrypted = decryptText(encrypted, inputKey);
    setDecryptedText(decrypted);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Symulacja strumieniowego szyfrowania AES</h1>
      <div className={styles.formGroup}>
        <label htmlFor="keyInput">Klucz szyfrowania:</label>
        <input
          id="keyInput"
          type="text"
          value={key}
          onChange={handleKeyChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="textInput">Tekst jawny:</label>
        <input
          id="textInput"
          type="text"
          value={text}
          onChange={handleTextChange}
          className={styles.input}
        />
      </div>
      <div className={styles.output}>
        <h3>Szyfrogram:</h3>
        <p className={styles.cipherText}>{cipherText}</p>
      </div>
      <div className={styles.output}>
        <h3>Odszyfrowany tekst:</h3>
        <p className={styles.decryptedText}>{decryptedText}</p>
      </div>
    </div>
  );
};

export default AESStream;
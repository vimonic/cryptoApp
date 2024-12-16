import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import styles from './HMAC.module.css';

const HMAC: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('super-secret-key');
  const [generatedHmac, setGeneratedHmac] = useState<string | null>(null);
  const [receivedHmac, setReceivedHmac] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const generateHmac = () => {
    if (!message || !secretKey) return alert('Wprowadź wiadomość i klucz.');
    const hmac = CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Hex);
    setGeneratedHmac(hmac);
    setVerificationResult(null);
  };

  const verifyHmac = () => {
    if (!message || !secretKey || !receivedHmac) return alert('Brak danych do weryfikacji.');
    const expectedHmac = CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Hex);
    if (expectedHmac === receivedHmac) {
      setVerificationResult('Weryfikacja zakończona sukcesem! HMAC jest poprawny.');
    } else {
      setVerificationResult('Weryfikacja nie powiodła się. HMAC jest niepoprawny.');
    }
  };

  return (
    <div className={styles.container}>
      <h3>Symulacja HMAC</h3>
      <div className={styles.section}>
        <h4>Nadawca</h4>
        <label>
          Wiadomość:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Wpisz wiadomość"
          />
        </label>
        <label>
          Sekretny klucz:
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Sekretny klucz"
          />
        </label>
        <button onClick={generateHmac}>Generuj HMAC</button>
        {generatedHmac && (
          <div className={styles.result}>
            <strong>Wygenerowany HMAC:</strong>
            <pre>{generatedHmac}</pre>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h4>Odbiorca</h4>
        <label>
          Otrzymany HMAC:
          <input
            type="text"
            value={receivedHmac}
            onChange={(e) => setReceivedHmac(e.target.value)}
            placeholder="Wprowadź otrzymany HMAC"
          />
        </label>
        <button onClick={verifyHmac}>Weryfikuj HMAC</button>
        {verificationResult && (
          <div className={styles.verification}>
            <strong>Wynik weryfikacji:</strong>
            <p>{verificationResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HMAC;
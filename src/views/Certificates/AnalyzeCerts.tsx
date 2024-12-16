import React, { useState } from 'react';
import styles from './AnalyzeCerts.module.css';

const AnalyzeCerts: React.FC = () => {
  const [url, setUrl] = useState('');
  const [certData, setCertData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificate = async () => {
    try {
      setError(null);
      setCertData(null);

      const response = await fetch('http://localhost:5000/get-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać certyfikatu');
      }

      const data = await response.json();
      setCertData(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analiza certyfikatów TLS</h1>
      <div className={styles.formGroup}>
        <label htmlFor="urlInput">Podaj adres URL strony internetowej:</label>
        <input
          id="urlInput"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className={styles.input}
        />
      </div>
      <button onClick={fetchCertificate} className={styles.button}>
        Pobierz certyfikat
      </button>
      {error && <p className={styles.error}>Błąd: {error}</p>}
      {certData && (
        <div className={styles.result}>
          <h3>Dane certyfikatu:</h3>
          <pre className={styles.certData}>{certData}</pre>
        </div>
      )}
    </div>
  );
};

export default AnalyzeCerts;
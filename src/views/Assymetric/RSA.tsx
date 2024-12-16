import React, { useState } from 'react';
import forge from 'node-forge';
import styles from './RSA.module.css';

const RSA: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [plainText, setPlainText] = useState<string>('');
  const [cipherText, setCipherText] = useState<string>('');
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [encryptedFileContent, setEncryptedFileContent] = useState<string>('');
  const [decryptedFileContent, setDecryptedFileContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const logStep = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const generateKeys = () => {
    setIsGenerating(true);
    logStep('Rozpoczęto proces generowania kluczy RSA...');
    logStep('Generowanie 2048-bitowych par kluczy RSA używając algorytmu RSA-OAEP...');
    
    setTimeout(() => {
      const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);

      logStep('Wygenerowano klucze publiczny i prywatny.');
      logStep('Długość klucza: 2048 bitów');
      logStep('Używanie RSA-OAEP do generowania kluczy i szyfrowania/deszyfrowania');
      logStep('Format PEM klucza publicznego i format PEM klucza prywatnego są gotowe.');
    
      setPublicKey(forge.pki.publicKeyToPem(publicKey));
      setPrivateKey(forge.pki.privateKeyToPem(privateKey));

      logStep('Generowanie klucza RSA zakończone pomyślnie.');
      
      setIsGenerating(false);
    }, 2000);
  };

  const encryptText = () => {
    if (!plainText || !publicKey) return;
    
    logStep('Rozpoczęcie szyfrowania tekstu...');
    logStep('Używanie klucza publicznego RSA z RSA-OAEP do szyfrowania...');
    
    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    
    const encrypted = publicKeyObj.encrypt(plainText, 'RSA-OAEP');
    
    const encryptedBase64 = forge.util.encode64(encrypted);

    logStep('Tekst został pomyślnie zaszyfrowany.');
    logStep('Wynik szyfrowania jest w formacie Base64.');
    setCipherText(encryptedBase64);
  };

  const decryptText = () => {
    if (!cipherText || !privateKey) return;
    
    logStep('Rozpoczęcie deszyfrowania tekstu...');
    logStep('Używanie klucza prywatnego RSA z RSA-OAEP do deszyfrowania...');
    
    const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
    const decodedEncryptedText = forge.util.decode64(cipherText);

    const decrypted = privateKeyObj.decrypt(decodedEncryptedText, 'RSA-OAEP');

    logStep('Tekst został pomyślnie odszyfrowany.');
    setDecryptedText(decrypted);
  };

  const encryptFile = () => {
    if (!publicKey || !fileContent) {
        logStep('Brak klucza publicznego lub treści pliku.');
        return;
    }

    logStep('Rozpoczęcie szyfrowania pliku...');
    
    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);

    const maxSize = 245;
    if (fileContent.length > maxSize) {
        logStep(`Plik jest za duży. Maksymalny rozmiar to ${maxSize} bajtów.`);
        return;
    }

    logStep('Używanie klucza publicznego RSA z RSA-OAEP do szyfrowania pliku...');
    
   
    try {
        const encryptedData = publicKeyObj.encrypt(fileContent, 'RSA-OAEP');
        

        const encryptedBase64 = forge.util.encode64(encryptedData);
        
        logStep('Plik został pomyślnie zaszyfrowany.');
        logStep('Zawartość pliku jest szyfrowana w formacie Base64.');

        setEncryptedFileContent(encryptedBase64); 
    } catch (error) {
        logStep('Błąd podczas szyfrowania: ' + error);
        console.error(error);
    }
  };

  
  const decryptFile = () => {
    if (!privateKey || !encryptedFileContent) {
        logStep('Brak klucza prywatnego lub zaszyfrowanego pliku.');
        return;
    }

    logStep('Rozpoczęcie deszyfrowania pliku...');
    logStep('Używanie klucza prywatnego RSA z RSA-OAEP do deszyfrowania pliku...');
    
    try {
        const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);

        const encryptedData = forge.util.decode64(encryptedFileContent);

        const maxSize = 256; 
        if (encryptedData.length > maxSize) {
            logStep(`Zaszyfrowany plik jest za duży. Maksymalny rozmiar to ${maxSize} bajtów.`);
            return;
        }

        const decryptedData = privateKeyObj.decrypt(encryptedData, 'RSA-OAEP');

        setDecryptedFileContent(decryptedData);

        logStep('Plik został pomyślnie odszyfrowany.');

    } catch (error) {
        logStep('Błąd deszyfrowania: ' + error);
        console.error(error);
    }
  };


  
    

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        readFile(file);
      }
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const fileContent = e.target.result as string;
        setFileContent(fileContent);
      }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    setPublicKey('');
    setPrivateKey('');
    setPlainText('');
    setCipherText('');
    setDecryptedText('');
    setFileContent('');
    setEncryptedFileContent('');
    setDecryptedFileContent('');
    setLogs([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.leftPane}>
        <h2>Szyfrowanie i deszyfracja algorytmem RSA</h2>
        <button onClick={generateKeys} disabled={isGenerating}>
          {isGenerating ? 'Generowanie...' : 'Generuj klucze RSA'}
        </button>
        
        {isGenerating && <div>Proszę czekać, generowanie kluczy...</div>}

          <div className={styles.keysContainer}>
            <div>
              <h4>Klucz publiczny</h4>
              <textarea value={publicKey} readOnly rows={10} cols={25}></textarea>
            </div>
            <div>
              <h4>Klucz prywatny</h4>
              <textarea value={privateKey} readOnly rows={10} cols={25}></textarea>
            </div>
          </div>

          <div>
            <h4>Tekst jawny</h4>
            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              rows={5}
              cols={50}
            ></textarea>
          </div>

          <button onClick={encryptText}>Szyfruj tekst</button>
          <button onClick={decryptText}>Odszyfruj tekst</button>

          <div className={styles.encryptedDecrypted}>
            <div>
              <h4>Szyfrogram (Base64)</h4>
              <textarea value={cipherText} readOnly rows={5} cols={50}></textarea>
            </div>
            <div>
              <h4>Tekst jawny</h4>
              <textarea value={decryptedText} readOnly rows={5} cols={50}></textarea>
            </div>
          </div>

          <div>
            <h4>Wybierz plik d ozaszyfrowania</h4>
            <input type="file" onChange={handleFileChange} />
            <button onClick={encryptFile}>Szyfruj plik</button>
            <button onClick={decryptFile}>Odszyfruj plik</button>
          </div>

          <div className={styles.encryptedDecrypted}>
            <div>
              <h4>Szyfrogram pliku</h4>
              <textarea value={encryptedFileContent} readOnly rows={5} cols={50}></textarea>
            </div>
            <div>
              <h4>Jawne dane pliku</h4>
              <textarea value={decryptedFileContent} readOnly rows={5} cols={50}></textarea>
            </div>
          </div>

          <button onClick={reset}>Resetuj proces</button>
        </div>

        <div className={styles.rightPane}>
          <h4>Logi operacji</h4>
          <div className={styles.logWindow}>
            <ul>
              {logs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSA;
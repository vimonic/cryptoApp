import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import styles from './DES.module.css';

const DES: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [key, setKey] = useState('mocny_klucz12345');
  const [iv, setIv] = useState<string>('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'ECB' | 'CFB'>('ECB'); 
  const [keyError, setKeyError] = useState('');

  const validateKeyLength = (key: string) => {
    if (key.length < 8) {
      setKeyError('Klucz musi mieć co najmniej 8 znaków.');
    } else {
      setKeyError('');
    }
  };

  const encryptText = () => {
    validateKeyLength(key);
    if (keyError) return;
  
    // Przycinamy klucz do 8 bajtów (64-bitów) zgodnie ze specyfikacją DES
    let parsedKey = CryptoJS.enc.Utf8.parse(key);
    parsedKey = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 2));
  
    let ciphertext = '';
    
    // Tryb ECB - szyfrowanie blokowe, nie wymaga wektora IV
    if (mode === 'ECB') {
      // Szyfrowanie w trybie ECB bez IV
      ciphertext = CryptoJS.DES.encrypt(plainText, parsedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
    } else if (mode === 'CFB') {
      // Tryb CFB - szyfrowanie strumieniowe, wymaga wektora IV
      const parsedIv = iv ? CryptoJS.enc.Hex.parse(iv) : undefined;
      ciphertext = CryptoJS.DES.encrypt(plainText, parsedKey, {
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7,
        iv: parsedIv,
      }).toString();
    }
  
    setEncryptedText(ciphertext || '');
  };
  
  const decryptText = () => {
    let parsedKey = CryptoJS.enc.Utf8.parse(key);
    parsedKey = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 2));
  
    let bytes: CryptoJS.lib.WordArray | undefined;
  
    if (mode === 'ECB') {
      bytes = CryptoJS.DES.decrypt(encryptedText, parsedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
    } else if (mode === 'CFB') {
      const parsedIv = iv ? CryptoJS.enc.Hex.parse(iv) : undefined;
      bytes = CryptoJS.DES.decrypt(encryptedText, parsedKey, {
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7,
        iv: parsedIv,
      });
    }
  
    const decrypted = bytes ? bytes.toString(CryptoJS.enc.Utf8) : '';
    setDecryptedText(decrypted);
  };
  

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const encryptFile = async () => {
    if (file && key) {
        validateKeyLength(key);
        if (keyError) return;

        const reader = new FileReader();
        reader.onload = () => {
            const fileData = reader.result as ArrayBuffer;
            const wordArray = CryptoJS.lib.WordArray.create(fileData);

            let parsedKey = CryptoJS.enc.Utf8.parse(key);
            parsedKey = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 2));

            let encryptedFileData = '';

            if (mode === 'ECB') {
                encryptedFileData = CryptoJS.DES.encrypt(wordArray, parsedKey, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7,
                }).toString();
            } else if (mode === 'CFB') {
                const parsedIv = iv ? CryptoJS.enc.Hex.parse(iv) : undefined;
                encryptedFileData = CryptoJS.DES.encrypt(wordArray, parsedKey, {
                    mode: CryptoJS.mode.CFB,
                    padding: CryptoJS.pad.Pkcs7,
                    iv: parsedIv,
                }).toString();
            }

            setEncryptedFile(encryptedFileData || '');
        };
        reader.readAsArrayBuffer(file);
    }
  };

  
  const decryptFile = () => {
    if (encryptedFile && key) {
      let parsedKey = CryptoJS.enc.Utf8.parse(key);
      parsedKey = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 2));
      let bytes: CryptoJS.lib.WordArray | undefined;
  
      if (mode === 'ECB') {
        bytes = CryptoJS.DES.decrypt(encryptedFile, parsedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
      } else if (mode === 'CFB') {
        const parsedIv = iv ? CryptoJS.enc.Hex.parse(iv) : undefined;
        bytes = CryptoJS.DES.decrypt(encryptedFile, parsedKey, {
          mode: CryptoJS.mode.CFB,
          padding: CryptoJS.pad.Pkcs7,
          iv: parsedIv,
        });
      }
  
      if (bytes) {
        const decryptedFileData = tryParseText(bytes);
  
        if (decryptedFileData.isText) {
          setDecryptedText(decryptedFileData.text);
        } else {
          const base64Data = bytes.toString(CryptoJS.enc.Base64);
          setDecryptedText(base64Data);
  
          const fileType = getFileType(base64Data);
          
          if (fileType === 'image') {
            const img = new Image();
            img.src = `data:image/jpeg;base64,${base64Data}`; 
            document.body.appendChild(img);
          } else if (fileType === 'pdf') {
            const pdfIframe = document.createElement('iframe');
            pdfIframe.src = `data:application/pdf;base64,${base64Data}`;
            document.body.appendChild(pdfIframe);
          } else {
            // const link = document.createElement('a');
            // link.href = `data:application/octet-stream;base64,${base64Data}`;
            // link.download = 'decrypted-file'; // Domyślna nazwa pliku
            // link.click();
          }
        }
      }
    }
  };
  
  
  const tryParseText = (bytes: CryptoJS.lib.WordArray): { isText: boolean; text: string } => {
    try {
    
      const text = bytes.toString(CryptoJS.enc.Utf8);
      
      if (text && text.trim().length > 0) {
        return { isText: true, text };
      }
    } catch (e) {
      
    }
    return { isText: false, text: '' };
  };
  
  const getFileType = (base64Data: string): string => {
    if (base64Data.startsWith('data:image')) {
      return 'image';
    }
    if (base64Data.startsWith('data:application/pdf')) {
      return 'pdf';
    }

    return 'binary'; 
  };



  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2>Szyfrowanie DES</h2>

        <label>Wybierz tryb szyfrowania:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'ECB' | 'CFB')}
          className={styles.select}
        >
          <option value="ECB">ECB (Tryb blokowy)</option>
          <option value="CFB">CFB (Tryb strumieniowy)</option>
        </select>
      </div>

      <label>Tekst jawny:</label>
      <textarea
        value={plainText}
        onChange={(e) => setPlainText(e.target.value)}
        className={styles.textArea}
      />

      <label>Klucz:</label>
      <input
        type={showPassword ? "text" : "password"}
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
          validateKeyLength(e.target.value);
        }}
        className={styles.input}
        placeholder="Wpisz klucz"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className={styles.button}
      >
        {showPassword ? "Ukryj hasło" : "Pokaż hasło"}
      </button>
      {keyError && <p className={styles.error}>{keyError}</p>}

      {mode === 'CFB' && (
        <>
          <label>Wektor IV (16 znaków w formacie hex):</label>
          <input
            type="text"
            value={iv}
            onChange={(e) => setIv(e.target.value)}
            className={styles.input}
            placeholder="Wpisz wektor IV"
          />
        </>
      )}

      <div className={styles.buttons}>
        <button onClick={encryptText} className={styles.button}>Zaszyfruj tekst:</button>
        <button onClick={decryptText} className={styles.button}>Odszyfruj tekst:</button>
      </div>

      <div className={styles.resultContainer}>
        <div className={styles.resultBox}>
          <label>Szyfrogram:</label>
          <textarea className={styles.textArea} value={encryptedText} readOnly />
        </div>
        <div className={styles.resultBox}>
          <label>Odszyfrowany tekst/plik:</label>
          <textarea className={styles.textArea} value={decryptedText} readOnly />
        </div>
      </div>

      <hr />

      <label>Wczytaj plik (tekstowy/obraz):</label>
      <input type="file" className={styles.fileInput} onChange={handleFileUpload} />

      <div className={styles.buttons}>
        <button onClick={encryptFile} className={styles.button}>Zaszyfruj plik</button>
        <button onClick={decryptFile} className={styles.button}>Odszyfruj plik</button>
      </div>

      {encryptedFile && (
        <>
          <label>Zaszyfrowane dane pliku:</label>
          <textarea value={encryptedFile} readOnly className={styles.textArea} />
        </>
      )}
    </div>
  );
};

export default DES;
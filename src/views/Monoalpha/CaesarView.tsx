import React, { useState } from 'react';
import styles from './CaesarView.module.css';

const CaesarCipherView: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [shift, setShift] = useState(0);
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);

  // Funkcja wywoływana po kliknięciu 'Zaszyfruj', uruchamia encryptCaesar
  // na podstawie podanego tekstu jawnego i przesunięcia, zapisując wynik w stanie.
  const handleEncrypt = () => {
    const encrypted = encryptCaesar(plainText, shift);
    setEncryptedText(encrypted);
    setIsEncrypted(true);
  };

  // Funkcja wywoływana po kliknięciu 'Odszyfruj', uruchamia decryptCaesar
  // na podstawie zaszyfrowanego tekstu i przesunięcia, zapisując wynik w stanie.
  const handleDecrypt = () => {
    const decrypted = decryptCaesar(encryptedText, shift);
    setDecryptedText(decrypted);
    setIsEncrypted(false);
  };

  // Implementacja funkcji encryptCaesar, która zamienia każdy znak w tekście na inny
  // o przesunięciu zgodnym z podanym shift. Zamiana opiera się na kodzie ASCII znaków.
  const encryptCaesar = (text: string, shift: number) => {
    return text.replace(/[a-z]/gi, (char) => {
      const code = char.charCodeAt(0);
      
      // Jeśli znak jest wielką literą (kod ASCII 65-90), stosujemy przesunięcie
      // na podstawie kodu 'A' (65), dodając przesunięcie `shift` i zwracając nowy znak.
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      
      // Jeśli znak jest małą literą (kod ASCII 97-122), stosujemy podobne przesunięcie
      // na podstawie kodu 'a' (97).
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      // Jeśli znak nie jest literą (np. spacja), pozostaje bez zmian.
      return char;
    });
  };

  // Implementacja `decryptCaesar`, która działa odwrotnie niż `encryptCaesar`,
  // cofając przesunięcie, aby uzyskać tekst jawny.
  const decryptCaesar = (text: string, shift: number) => {
    return text.replace(/[a-z]/gi, (char) => {
      const code = char.charCodeAt(0);
      // Dla wielkich liter (kod ASCII 65-90) odejmujemy `shift` i zwracamy nowy znak.
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      // Dla małych liter odejmujemy `shift` zgodnie z kodem ASCII dla 'a' (97).
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      // Znaki nie będące literami pozostają bez zmian.
      return char;
    });
  };

  return (
    <div className={styles.caesarContainer}>
      <h2>Szyfr Cezara (przestawieniowy)</h2>
      <div className={styles.inputGroup}>
        <label>Tekst jawny:</label>
        <input 
          type="text" 
          value={plainText} 
          onChange={(e) => setPlainText(e.target.value)} 
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Przesunięcie:</label>
        <input 
          type="number" 
          value={shift} 
          onChange={(e) => setShift(parseInt(e.target.value, 10))} 
        />
      </div>
      <button onClick={handleEncrypt}>Zaszyfruj</button>
      
      {encryptedText && (
        <div className={styles.result}>
          <h3>Szyfrogram:</h3>
          <p>{encryptedText}</p>
        </div>
      )}

      {isEncrypted && (
        <button onClick={handleDecrypt}>Odszyfruj</button>
      )}

      {decryptedText && (
        <div className={styles.result}>
          <h3>Tekst jawny:</h3>
          <p>{decryptedText}</p>
        </div>
      )}
    </div>
  );
};

export default CaesarCipherView;
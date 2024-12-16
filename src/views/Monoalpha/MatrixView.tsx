import React, { useState } from 'react';
import styles from './MatrixView.module.css';

const MatrixCipher: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [key, setKey] = useState('4'); // Liczba kolumn
  const [matrix, setMatrix] = useState<string[][]>([]);
  const [action, setAction] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Funkcja tworząca macierz na podstawie tekstu i liczby kolumn
  const createMatrix = (text: string, columns: number): string[][] => {
    const rows = Math.ceil(text.length / columns); // Oblicza liczbę wierszy
    // Tworzy macierz, dzieląc tekst na kolumny i wypełniając puste miejsca spacjami
    const matrix = Array.from({ length: rows }, (_, i) =>
      text.slice(i * columns, (i + 1) * columns).padEnd(columns, ' ').split('')
    );
    return matrix;
  };

  // Funkcja transponująca macierz na podstawie klucza
  const transposeMatrix = (matrix: string[][], key: number[]): string[][] => {
    // Przestawia kolumny w macierzy według sekwencji klucza
    return matrix[0].map((_, colIndex) => matrix.map(row => row[key[colIndex] - 1] || ' '));
  };

  // Funkcja szyfrująca
  const handleEncrypt = () => {
    const columns = parseInt(key, 10); 
    const originalMatrix = createMatrix(plainText, columns); 
    setMatrix(originalMatrix);

    const keySequence = Array.from({ length: columns }, (_, i) => i + 1); 
    const transposedMatrix = transposeMatrix(originalMatrix, keySequence); 
    const encryptedText = transposedMatrix.flat().join('');  
    setCipherText(encryptedText);
    setAction('encrypt');
  };

  // Funkcja deszyfrująca
  const handleDecrypt = () => {
    const columns = parseInt(key, 10);
    const keySequence = Array.from({ length: columns }, (_, i) => i + 1);
    const textLength = cipherText.length; 
    const rows = Math.ceil(textLength / columns);

    const cipherMatrix = createMatrix(cipherText, rows);
    setMatrix(cipherMatrix);
    
    const reversedMatrix = transposeMatrix(cipherMatrix, keySequence);
    const decryptedText = reversedMatrix.flat().join('').trim(); 
    setPlainText(decryptedText);
    setAction('decrypt');
  };

  return (
    <div className={styles.matrixCipher}>
      <h2>Szyfrowanie Macierzowe z Transpozycją</h2>
      <div className={styles.inputSection}>
        <textarea
          rows={5}
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          placeholder="Wpisz tekst jawny"
        />
        Liczba kolumn:
        <input
          type="number"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          min="2"
          max="10"
          placeholder="Liczba kolumn"
        />
      </div>

      <div className={styles.buttonSection}>
        <button onClick={handleEncrypt}>Zaszyfruj</button>
        <button onClick={handleDecrypt}>Odszyfruj</button>
      </div>

      {matrix.length > 0 && (
        <div className={styles.matrixDisplay}>
          <h3>{action === 'encrypt' ? 'Macierz po zaszyfrowaniu' : 'Macierz po odszyfrowaniu'}</h3>
          <div className={styles.matrix}>
            {matrix.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((cell, colIndex) => (
                  <div key={colIndex} className={styles.cell}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.result}>
        <h3>Wynik:</h3>
        <textarea
          rows={5}
          readOnly
          value={action === 'encrypt' ? cipherText : plainText}
        />
      </div>
    </div>
  );
};

export default MatrixCipher;
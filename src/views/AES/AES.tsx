import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import styles from './AES.module.css';

const AES: React.FC = () => {
    const [plainText, setPlainText] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [key, setKey] = useState('mocny_klucz12345');
    const [iv, setIv] = useState<string>('');
    const [encryptedText, setEncryptedText] = useState('');
    const [decryptedText, setDecryptedText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [encryptedFile, setEncryptedFile] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<'ECB' | 'CTR'>('ECB'); 
    const [keyError, setKeyError] = useState('');

    const validateKeyLength = (key: string): boolean => {
        if (![16, 24, 32].includes(key.length)) {
            setKeyError('Klucz musi mieć 16, 24 lub 32 znaki.');
            return false;
        } else {
            setKeyError('');
            return true;
        }
    };
    
    const encryptText = () => {
        if (!validateKeyLength(key)) {
            return;
        }
    
        try {
            const parsedKey = CryptoJS.enc.Utf8.parse(key);
            const parsedIv = mode === 'CTR' ? CryptoJS.enc.Hex.parse(iv) : undefined;
    
            const ciphertext = CryptoJS.AES.encrypt(plainText, parsedKey, {
                mode: mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CTR,
                iv: parsedIv,
                padding: CryptoJS.pad.Pkcs7,
            }).toString();
    
            setEncryptedText(ciphertext || '');
        } catch (error) {
            console.error('Błąd szyfrowania:', error);
            setKeyError('Wystąpił błąd podczas szyfrowania.');
        }
    };

    const decryptText = () => {
        const parsedKey = CryptoJS.enc.Utf8.parse(key);
        const parsedIv = mode === 'CTR' ? CryptoJS.enc.Hex.parse(iv) : undefined;

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedText, parsedKey, {
                mode: mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CTR,
                iv: parsedIv,
                padding: CryptoJS.pad.Pkcs7,
            });
            setDecryptedText(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            setDecryptedText("Błąd deszyfrowania.");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0] || null;
        setFile(uploadedFile);
        setFileName(uploadedFile?.name || null);
    };

    const encryptFile = async () => {
        if (file && key) {
            validateKeyLength(key);
            if (keyError) return
    
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = reader.result as string; 
                const parsedKey = CryptoJS.enc.Utf8.parse(key);
                const parsedIv = mode === 'CTR' ? CryptoJS.enc.Hex.parse(iv) : undefined;
    
                try {
                    const encryptedFileData = CryptoJS.AES.encrypt(fileData, parsedKey, {
                        mode: mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CTR,
                        iv: parsedIv,
                        padding: CryptoJS.pad.Pkcs7,
                    }).toString();
    
                    setEncryptedFile(encryptedFileData || '');
                } catch (error) {
                    console.error('Błąd podczas szyfrowania:', error);
                }
            };
            reader.readAsText(file);
        } else {
            console.error('Brak pliku lub klucza');
        }
    };
    

    const saveEncryptedFile = () => {
        if (!encryptedFile || !fileName) return;
    
        const [name, extension] = fileName.split('.');
        
        let mimeType = 'text/plain';
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'gif':
                mimeType = 'image/gif';
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            default:
                mimeType = 'text/plain';
                break;
        }
    
        const blob = new Blob([encryptedFile], { type: mimeType });
    
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}_encrypted.${extension}`;
        link.click();
    
        URL.revokeObjectURL(url);
    };
    

    const decryptFile = () => {
        if (encryptedFile && key) {
            const parsedKey = CryptoJS.enc.Utf8.parse(key);
            const parsedIv = mode === 'CTR' ? CryptoJS.enc.Hex.parse(iv) : undefined;

            try {
                const bytes = CryptoJS.AES.decrypt(encryptedFile, parsedKey, {
                    mode: mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CTR,
                    iv: parsedIv,
                    padding: CryptoJS.pad.Pkcs7,
                });
                setDecryptedText(bytes.toString(CryptoJS.enc.Utf8));
            } catch (error) {
                setDecryptedText("Błąd deszyfrowania pliku.");
            }
        }
    };

    const saveDecryptedFile = () => {
        if (decryptedText && file) {
            const fileExtension = file.name.split('.').pop();
            const baseFileName = file.name.replace(/\.[^/.]+$/, '');
    
            let mimeType = 'text/plain';
            switch (fileExtension) {
                case 'jpg':
                case 'jpeg':
                    mimeType = 'image/jpeg';
                    break;
                case 'png':
                    mimeType = 'image/png';
                    break;
                case 'gif':
                    mimeType = 'image/gif';
                    break;
                case 'pdf':
                    mimeType = 'application/pdf';
                    break;
                case 'docx':
                    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    break;
                default:
                    mimeType = 'text/plain';
                    break;
            }
    
            const blob = new Blob([decryptedText], { type: mimeType });
    
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${baseFileName}_odszyfrowany.${fileExtension}`;
            link.click();
        }
    };
    

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <h2>Szyfrowanie AES</h2>
                <label>Wybierz tryb szyfrowania:</label>
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'ECB' | 'CTR')}
                    className={styles.select}
                >
                    <option value="ECB">ECB (Tryb blokowy)</option>
                    <option value="CTR">CTR (Tryb licznika)</option>
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

            {mode === 'CTR' && (
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
                <button onClick={encryptText} className={styles.button}>Zaszyfruj tekst</button>
                <button onClick={decryptText} className={styles.button}>Odszyfruj tekst</button>
            </div>

            <div className={styles.resultContainer}>
                <div className={styles.resultBox}>
                    <label>Szyfrogram:</label>
                    <textarea className={styles.textArea} value={encryptedText} readOnly />
                </div>
                <div className={styles.resultBox}>
                    <label>Odszyfrowany tekst:</label>
                    <textarea className={styles.textArea} value={decryptedText} readOnly />
                </div>
            </div>

            <hr />

            <div className={styles.fileSection}>
                <label>Wybierz plik do szyfrowania:</label>
                <input type="file" onChange={handleFileUpload} className={styles.fileInput} />
                <button onClick={encryptFile} className={styles.button}>Szyfruj plik</button>
                <button onClick={decryptFile} className={styles.button}>Odszyfruj plik</button>
                {encryptedFile && (
                    <button onClick={saveEncryptedFile} className={styles.button}>
                        Pobierz zaszyfrowany plik
                    </button>
                )}
                {encryptedFile && decryptedText && (
                    <button onClick={saveDecryptedFile} className={styles.button}>
                        Pobierz odszyfrowany plik
                    </button>
                )}
            </div>

            {encryptedFile && (
                <div className={styles.resultBox}>
                    <label>Zaszyfrowany plik:</label>
                    <textarea className={styles.textArea} value={encryptedFile} readOnly />
                </div>
            )}
        </div>
    );
};

export default AES;
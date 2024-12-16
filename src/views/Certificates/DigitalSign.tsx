import React, { useState } from 'react';
import forge from 'node-forge';
import styles from './DigitalSign.module.css';

const DigitalSign: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateKeys = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const rsa = forge.pki.rsa;
      const keys = rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
      setPublicKey(forge.pki.publicKeyToPem(keys.publicKey));
      setPrivateKey(forge.pki.privateKeyToPem(keys.privateKey));
      setIsLoading(false);
      alert('Wygenerowano klucze RSA!');
    }, 1000); 
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target?.result as string);
      reader.readAsText(file);
    }
  };

  const signFile = () => {
    if (!fileContent || !privateKey) return alert('Załaduj plik i wygeneruj klucze.');
    const md = forge.md.sha256.create();
    md.update(fileContent, 'utf8');

    const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
    const signature = privateKeyObj.sign(md);
    setSignature(forge.util.encode64(signature));
    alert('Plik został podpisany cyfrowo!');
  };

  const verifySignature = () => {
    if (!fileContent || !publicKey || !signature) return alert('Brak danych do weryfikacji.');
    const md = forge.md.sha256.create();
    md.update(fileContent, 'utf8');

    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    const signatureBytes = forge.util.decode64(signature);

    const verified = publicKeyObj.verify(md.digest().bytes(), signatureBytes);
    setVerificationResult(verified ? 'Podpis jest poprawny!' : 'Podpis jest nieprawidłowy!');
  };

  return (
    <div className={styles.container}>
      <h3>Podpis cyfrowy pliku (RSA)</h3>
      <div>
        {isLoading ? (
          <p className={styles.loading}>🔄 Generowanie kluczy RSA...</p>
        ) : (
          <button onClick={generateKeys}>Generuj klucze RSA</button>
        )}
      </div>
      <div>
        <input type="file" onChange={handleFileUpload} />
        <button onClick={signFile}>Podpisz plik</button>
        <button onClick={verifySignature}>Weryfikuj podpis</button>
      </div>
      {signature && (
        <div>
          <h4>Podpis:</h4>
          <pre>{signature}</pre>
        </div>
      )}
      {verificationResult && (
        <div>
          <h4>Wynik weryfikacji:</h4>
          <p>{verificationResult}</p>
        </div>
      )}
    </div>
  );
};

export default DigitalSign;
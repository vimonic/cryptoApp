import React, { useState } from "react";
import styles from "./DH.module.css";

const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
};

const DiffieHellman: React.FC = () => {
    const [g, setG] = useState<number>(0);
    const [p, setP] = useState<number>(0);
    const [clientPrivateKey, setClientPrivateKey] = useState<number>(0);
    const [serverPrivateKey, setServerPrivateKey] = useState<number>(0);
    const [clientPublicKey, setClientPublicKey] = useState<number | null>(null);
    const [serverPublicKey, setServerPublicKey] = useState<number | null>(null);
    const [sharedKeyClient, setSharedKeyClient] = useState<number | null>(null);
    const [sharedKeyServer, setSharedKeyServer] = useState<number | null>(null);
    const [step, setStep] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);

    const nextStep = () => {
        switch (step) {
            case 1:
                if (g && p && isPrime(p)) {
                    setError(null);
                    setStep(2);
                } else {
                    setError("Parametr p musi być liczbą pierwszą.");
                }
                break;
            case 2:
                if (clientPrivateKey && serverPrivateKey && g && p) {
                    setClientPublicKey(Math.pow(g, clientPrivateKey) % p);
                    setServerPublicKey(Math.pow(g, serverPrivateKey) % p);
                    setStep(3);
                }
                break;
            case 3:
                if (clientPublicKey && serverPublicKey && clientPrivateKey && serverPrivateKey && p) {
                    setSharedKeyClient(Math.pow(serverPublicKey, clientPrivateKey) % p);
                    setSharedKeyServer(Math.pow(clientPublicKey, serverPrivateKey) % p);
                    setStep(4);
                }
                break;
            default:
                setError(null);
        }
    };

    const resetProcess = () => {
        setG(0);
        setP(0);
        setClientPrivateKey(0);
        setServerPrivateKey(0);
        setClientPublicKey(null);
        setServerPublicKey(null);
        setSharedKeyClient(null);
        setSharedKeyServer(null);
        setStep(1);
        setError(null);
    };

    const cardBorderColor = sharedKeyClient === sharedKeyServer ? "green" : "red";

    return (
        <div className={styles.container}>
            <h3>Protokoł Wymiany Kluczy Diffie-Hellmana</h3>
            {step >= 1 && (
                <div className={styles.stage}>
                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <h4>Klient</h4>
                            <label>Generator (g):</label>
                            <input
                                type="number"
                                value={g}
                                onChange={(e) => setG(parseInt(e.target.value))}
                            />
                            <label>Liczba pierwsza (p):</label>
                            <input
                                type="number"
                                value={p}
                                onChange={(e) => setP(parseInt(e.target.value))}
                            />
                        </div>
                        <div className={styles.description}>
                            <p>Krok 1: Wybór wspólnych parametrów g (generator) i p (liczba pierwsza).</p>
                            <p>Te parametry są publiczne i znane obu stronom.</p>
                        </div>
                        <div className={styles.column}>
                            <h4>Serwer</h4>
                            <label>Generator (g):</label>
                            <input type="number" disabled value={g} />
                            <label>Liczba pierwsza (p):</label>
                            <input type="number" disabled value={p} />
                        </div>
                    </div>
                </div>
            )}
            {step >= 2 && (
                <div className={styles.stage}>
                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <h4>Klient</h4>
                            <label>Klucz prywatny klienta (a):</label>
                            <input
                                type="number"
                                value={clientPrivateKey}
                                onChange={(e) => setClientPrivateKey(parseInt(e.target.value))}
                            />
                        </div>
                        <div className={styles.description}>
                            <p>Krok 2: Klient i Serwer wybierają swoje klucze prywatne (a i b).</p>
                            <p>Klucze prywatne są trzymane w tajemnicy i nigdy nie są udostępniane.</p>
                        </div>
                        <div className={styles.column}>
                            <h4>Serwer</h4>
                            <label>Klucz prywatny serwera (b):</label>
                            <input
                                type="number"
                                value={serverPrivateKey}
                                onChange={(e) => setServerPrivateKey(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            )}
            {step >= 3 && (
                <div className={styles.stage}>
                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <h4>Klient</h4>
                            <p>Klucz publiczny klienta (A): {clientPublicKey}</p>
                        </div>
                        <div className={styles.description}>
                            <p>Krok 3: Obliczanie i wymiana kluczy publicznych.</p>
                            <p>Klient oblicza A = g^a mod p i wysyła A do serwera.</p>
                            <p>Serwer oblicza B = g^b mod p i wysyła B do klienta.</p>
                        </div>
                        <div className={styles.column}>
                            <h4>Serwer</h4>
                            <p>Klucz publiczny serwera (B): {serverPublicKey}</p>
                        </div>
                    </div>
                </div>
            )}
            {step >= 4 && (
                <div className={styles.stage}>
                    <div className={styles.columns}>
                        <div className={styles.column} style={{ border: `2px solid ${cardBorderColor}` }}>
                            <h4>Klient</h4>
                            <p>Wspólny sekret (obliczony przez klienta): {sharedKeyClient}</p>
                        </div>
                        <div className={styles.description}>
                            <p>Krok 4: Obliczanie wspólnego sekretu po obu stronach.</p>
                            <p>Jeśli K_klient i K_serwer są równe, wymiana kluczy była udana.</p>
                        </div>
                        <div className={styles.column} style={{ border: `2px solid ${cardBorderColor}` }}>
                            <h4>Serwer</h4>
                            <p>Wspólny sekret (obliczony przez serwer): {sharedKeyServer}</p>
                        </div>
                    </div>
                </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            {step < 4 && <button onClick={nextStep}>Dalej</button>}
            <button onClick={resetProcess} className={styles.resetButton}>Resetuj</button>
        </div>
    );
};

export default DiffieHellman;

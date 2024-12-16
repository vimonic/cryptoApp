import React, { useState } from "react";
import styles from "./HuffmanHamming.module.css";

const huffmanEncode = (text: string): { encoded: string; map: Record<string, string> } => {
    const freqMap: Record<string, number> = {};
    for (let char of text) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }

    const sorted = Object.entries(freqMap).sort((a, b) => a[1] - b[1]);
    const codes: Record<string, string> = {};

    sorted.forEach(([char], i) => {
        codes[char] = i.toString(2).padStart(3, "0");
    });

    const encoded = text.split("").map(char => codes[char]).join(" ");
    return { encoded, map: codes };
};

const hammingEncode = (data: string): string => {
    if (data.length !== 4) return "Wprowadź dokładnie 4 bity!";
    const d = data.split("").map(Number);
    const p1 = d[0] ^ d[1] ^ d[3];
    const p2 = d[0] ^ d[2] ^ d[3];
    const p4 = d[1] ^ d[2] ^ d[3];
    return `${p1}${p2}${d[0]}${p4}${d[1]}${d[2]}${d[3]}`;
};

const HuffmanHamming: React.FC = () => {
    const [text, setText] = useState("");
    const [huffmanResult, setHuffmanResult] = useState({ encoded: "", map: {} });

    const [hammingInput, setHammingInput] = useState("");
    const [hammingResult, setHammingResult] = useState("");

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3>Kodowanie Huffmana</h3>
                <input
                    type="text"
                    placeholder="Wprowadź tekst"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className={styles.input}
                />
                <button onClick={() => setHuffmanResult(huffmanEncode(text))} className={styles.button}>
                    Zakoduj
                </button>
                {huffmanResult.encoded && (
                    <div>
                        <p><strong>Zakodowany tekst:</strong> {huffmanResult.encoded}</p>
                        <p><strong>Mapa kodów:</strong></p>
                        <pre>{JSON.stringify(huffmanResult.map, null, 2)}</pre>
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h3>Kodowanie Hamminga (4 bity)</h3>
                <input
                    type="text"
                    placeholder="Wprowadź 4 bity (np. 1011)"
                    value={hammingInput}
                    onChange={e => setHammingInput(e.target.value)}
                    className={styles.input}
                />
                <button onClick={() => setHammingResult(hammingEncode(hammingInput))} className={styles.button}>
                    Zakoduj
                </button>
                {hammingResult && (
                    <p><strong>Kod Hamminga:</strong> {hammingResult}</p>
                )}
            </div>
        </div>
    );
};

export default HuffmanHamming;
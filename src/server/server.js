"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const url_1 = require("url");
const tls_1 = require("tls");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/get-certificate", (req, res) => {
    const { url } = req.body;
    if (!url) {
        return console.log({ error: 'Brak adresu URL' });
    }
    try {
        const parsedUrl = new url_1.URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: 443,
            method: "GET",
        };
        const reqTLS = https_1.default.request(options, (response) => {
            const socket = response.socket;
            if (!socket.authorized && socket.authorizationError) {
                return res.status(400).json({ error: socket.authorizationError });
            }
            if (socket instanceof tls_1.TLSSocket) {
                const cert = socket.getPeerCertificate(true);
                if (!cert || Object.keys(cert).length === 0) {
                    return res.status(404).json({ error: "Nie znaleziono certyfikatu" });
                }
                const certificateChain = cert.issuerCertificate ? [cert, cert.issuerCertificate] : [cert];
                res.json({
                    subject: cert.subject || 'Brak danych',
                    issuer: cert.issuer || 'Brak danych',
                    valid_from: cert.valid_from || 'Brak danych',
                    valid_to: cert.valid_to || 'Brak danych',
                    fingerprint: cert.fingerprint || 'Brak danych',
                    serialNumber: cert.serialNumber || 'Brak danych',
                    subjectaltname: cert.subjectaltname || 'Brak danych',
                    certificateChain: certificateChain.map((chainCert) => ({
                        subject: chainCert.subject || 'Brak danych',
                        issuer: chainCert.issuer || 'Brak danych',
                        valid_from: chainCert.valid_from || 'Brak danych',
                        valid_to: chainCert.valid_to || 'Brak danych',
                        fingerprint: chainCert.fingerprint || 'Brak danych',
                        serialNumber: chainCert.serialNumber || 'Brak danych',
                        subjectaltname: chainCert.subjectaltname || 'Brak danych',
                        extensions: chainCert.extensions || 'Brak danych',
                        signature: chainCert.signature || 'Brak danych'
                    }))
                });
            }
            else {
                res.status(500).json({ error: "Niepoprawne połączenie TLS" });
            }
        });
        reqTLS.on("error", (error) => {
            console.error("Błąd połączenia TLS:", error);
            res.status(500).json({ error: "Błąd połączenia TLS" });
        });
        reqTLS.end();
    }
    catch (error) {
        console.error("Nieprawidłowy URL:", error);
        res.status(500).json({ error: "Nieprawidłowy URL" });
    }
});
// Serwowanie statycznych plików frontendowych
app.use(express_1.default.static(path_1.default.join(__dirname, '../../build')));
// Obsługa wszystkich innych ścieżek i renderowanie aplikacji React
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../build', 'index.html'));
});
// Uruchomienie serwera
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

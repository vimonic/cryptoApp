"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const url_1 = require("url");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/get-certificate', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Brak adresu URL' });
    }
    try {
        const parsedUrl = new url_1.URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: 443,
            method: 'GET',
        };
        const reqTLS = https_1.default.request(options, (response) => {
            const socket = response.socket;
            if (!socket.authorized && socket.authorizationError) {
                return res.status(400).json({ error: socket.authorizationError });
            }
            const cert = socket.getPeerCertificate();
            if (!cert || Object.keys(cert).length === 0) {
                return res.status(404).json({ error: 'Nie znaleziono certyfikatu' });
            }
            res.json({
                subject: cert.subject,
                issuer: cert.issuer,
                valid_from: cert.valid_from,
                valid_to: cert.valid_to,
                fingerprint: cert.fingerprint,
            });
        });
        reqTLS.on('error', (error) => {
            console.error('Błąd połączenia TLS:', error);
            res.status(500).json({ error: 'Błąd połączenia TLS' });
        });
        reqTLS.end();
    }
    catch (error) {
        console.error('Nieprawidłowy URL:', error);
        res.status(500).json({ error: 'Nieprawidłowy URL' });
    }
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

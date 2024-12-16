import express, { Request, Response } from "express";
import cors from "cors";
import https from "https";
import { URL } from "url";
import { TLSSocket } from "tls";
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

app.post("/get-certificate", (req: Request, res: Response): void => {
    const { url }: { url: string | undefined } = req.body;
  
    if (!url) {
      return console.log({ error: 'Brak adresu URL' });
    }
  
    try {
      const parsedUrl = new URL(url);
  
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        method: "GET",
      };
  
      const reqTLS = https.request(options, (response: any) => {
        const socket = response.socket;
  
        if (!socket.authorized && socket.authorizationError) {
          return res.status(400).json({ error: socket.authorizationError });
        }
  
        if (socket instanceof TLSSocket) {
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
  
            certificateChain: certificateChain.map((chainCert: any) => ({
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
        } else {
          res.status(500).json({ error: "Niepoprawne połączenie TLS" });
        }
      });
  
      reqTLS.on("error", (error: any) => {
        console.error("Błąd połączenia TLS:", error);
        res.status(500).json({ error: "Błąd połączenia TLS" });
      });
  
      reqTLS.end();
    } catch (error) {
      console.error("Nieprawidłowy URL:", error);
      res.status(500).json({ error: "Nieprawidłowy URL" });
    }
});

// Serwowanie statycznych plików frontendowych
app.use(express.static(path.join(__dirname, '../../build')));

// Obsługa wszystkich innych ścieżek i renderowanie aplikacji React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Uruchomienie serwera
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
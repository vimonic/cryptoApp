import React, {useState} from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import CaesarCipherView from './views/Monoalpha/CaesarView';
import MatrixCipher from './views/Monoalpha/MatrixView';
import Vigenere from './views/Polialpha/Vigenere';
import DES from './views/DES/DES';
import AES from './views/AES/AES';
import DiffieHellman from './views/Assymetric/DH';
import RSA from './views/Assymetric/RSA';
import AESStream from './views/AES/StreamCipher';
import AnalyzeCerts from './views/Certificates/AnalyzeCerts';
import DigitalSign from './views/Certificates/DigitalSign';
import HMAC from './views/Certificates/HMAC';
import HuffmanHamming from './views/Kodowania/HuffmanHamming';
import styles from './App.module.css';

function App() {
  const [activeView, setActiveView] = useState('home');

  const renderActiveView = () => {
    if (activeView === 'caesar') {
      return <CaesarCipherView />;
    } else if (activeView === 'matrix') {
      return <MatrixCipher />;
    } else if (activeView === 'vigenere') {
      return <Vigenere />;
    }  else if (activeView === 'des') {
      return <DES />;
    } else if (activeView === 'aes') {
      return <AES />;
    } else if (activeView === 'settings') {
      return <div>Settings View</div>;
    } else if (activeView === 'dh') {
      return <DiffieHellman />;
    } else if (activeView === 'rsa') {
      return <RSA />;
    } else if (activeView === 'aestream') {
      return <AESStream />;
    } else if (activeView === 'certs') {
      return <AnalyzeCerts />;
    } else if (activeView === 'sign') {
      return <DigitalSign />;
    } else if (activeView === 'hmac') {
      return <HMAC />;
    } else if (activeView === 'hh') {
      return <HuffmanHamming />;
    }
    return <div>Witaj w naszej CryptoApp!</div>;
  };

  return (
    <div className={styles.app}>
      <Sidebar setActiveView={setActiveView} />
      <MainContent>{renderActiveView()}</MainContent>
      <Footer />
    </div>
  );
}

export default App;
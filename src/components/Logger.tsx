import React from 'react';
import styles from './Logger.module.css';

interface LogModalProps {
    logs: string[];
    isVisible: boolean;
    onClose: () => void;
}

const LogModal: React.FC<LogModalProps> = ({ logs, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton}>X</button>
                <div className={styles.logsContainer}>
                    {logs.map((log, index) => (
                        <p key={index} className={styles.logText}>{log}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogModal;
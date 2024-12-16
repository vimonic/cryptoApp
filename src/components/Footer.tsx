import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <p>&copy; 2024 Crypto App</p>
    </div>
  );
};

export default Footer;
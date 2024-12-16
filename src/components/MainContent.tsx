import React, { ReactNode } from 'react';
import styles from './MainContent.module.css';

interface MainContentProps {
  children: ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return (
    <div className={styles.mainContent}>
      {children}
    </div>
  );
}

export default MainContent;